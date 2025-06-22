import { NextRequest, NextResponse } from 'next/server';
import { Transaction, TransactionModel } from '@/models/Transaction';
import { authOptions, config } from '@/config';
import { getServerSession } from 'next-auth';
import { walletService } from '@/services/Wallet';
import { UserModel } from '@/models/User';
import { User } from '@/models/User';
import { DepositWallet, DepositWalletModel } from '@/models/DepositWallet';
import { encryptPrivateKey } from '@/utils/encrypt';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const supportedChains = Object.keys(config.wallet.supportedChains).map(chain => {
            const tokens = config.wallet.supportedChains[chain as keyof typeof config.wallet.supportedChains].supportedTokens.map(val => val.token);
            return {
                chain: chain,
                tokens: tokens
            };
        });

        const depositWallets = [];
        for( const supportedChain of supportedChains) {
            const wallet = await DepositWalletModel.findOne({userId: session.user.id, chain: supportedChain.chain, available: true}) as DepositWallet;
            if(!wallet) {
                const newWallet = await walletService.generateWalletCredentials(supportedChain.chain as keyof typeof config.wallet.supportedChains);
                await DepositWalletModel.create({
                    userId: session.user.id,
                    address: newWallet.address,
                    privateKeyEncrypted: encryptPrivateKey(newWallet.privateKey),
                    chain: supportedChain.chain,
                });

                depositWallets.push({
                    chain: supportedChain.chain,
                    address: newWallet.address,
                    available: true,
                    userId: session.user.id
                })
            } else {
                depositWallets.push({
                    chain: wallet.chain,
                    address: wallet.address,
                    available: wallet.available,
                    userId: wallet.userId
                })
            }
        }

        return NextResponse.json({ success: true, data: { walletAddresses: depositWallets, supportedChains } });
    } catch (error) {
        console.error('Error fetching wallet:', error);
        return NextResponse.json({ error: 'Failed to fetch wallet' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await UserModel.findOne({ email: session.user.email }) as User;    
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const { walletAddress, chain, token } = await request.json();

        await DepositWalletModel.updateOne({ address: walletAddress, chain: chain, userId: user._id }, { $set: { available: false, token: token } });

        const newTransaction: Partial<Transaction> = {
            transactionId: 'not-set',
            fromUserId: user._id,
            toAddress: walletAddress,
            type: 'deposit',
            startDate: new Date(),
            status: 'pending',
            token: token,
            chain: chain,
        }

        const transaction = await TransactionModel.create(newTransaction);

        return NextResponse.json({ success: true, data: { transaction } });
    } catch (error) {
        console.error('Error fetching wallet:', error);
        return NextResponse.json({ error: 'Failed to fetch wallet' }, { status: 500 });
    }
}