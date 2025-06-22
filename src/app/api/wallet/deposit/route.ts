import { NextRequest, NextResponse } from 'next/server';
import { CentralWalletModel } from '@/models/CentralWallet';
import { Transaction, TransactionModel } from '@/models/Transaction';
import { authOptions, config } from '@/config';
import { getServerSession } from 'next-auth';
import { walletService } from '@/services/Wallet';
import { UserModel } from '@/models/User';
import { User } from '@/models/User';
import { CryptoPriceModel } from '@/models/CryptoPrice';
import { DepositWallet, DepositWalletModel, DepositWalletWithoutKeys } from '@/models/DepositWallet';
import { encryptPrivateKey } from '@/utils/encrypt';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const wallets = await DepositWalletModel.find({userId: session.user.id, available: true}) as DepositWallet[];

        const walletWithoutKeys = wallets.map(w => ({
            address: w.address,
            chain: w.chain,
        })) as DepositWalletWithoutKeys[];

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

        const { chain, token, transactionId, fromAddress, toAddress } = await request.json();

        const wallet = await CentralWalletModel.findOne({ address: toAddress });

        if (!wallet) {
            return NextResponse.json({ error: 'Wallet not found' }, { status: 404 });
        }

        if (await TransactionModel.findOne({ transactionId })) {
            return NextResponse.json({ error: 'Transaction already exists' }, { status: 400 });
        }

        const txDetails = await walletService.getTxDetails(transactionId, chain);

        if (txDetails.status === 'notStarted') {
            return NextResponse.json({ error: 'Transaction not started' }, { status: 400 });
        }

        const cryptoPrice = await CryptoPriceModel.find({ symbol: token }).sort({ timestamp: -1 }).limit(1);

        const newTransaction: Partial<Transaction> = {
            transactionId,
            fromAddress: fromAddress,
            toAddress: toAddress,
            type: 'deposit',
            startDate: new Date(),
            remarks: `${user.name} deposited ${txDetails.amount} ${token} from ${txDetails.fromAddress} to ${txDetails.toAddress}`,
            token: token,
            chain: chain,
            fromUserId: user._id,
        }

        if (txDetails.amount) {
            newTransaction.amountInUSD = txDetails.amount * (cryptoPrice[0]?.price || 1);
        }

        const transaction = await TransactionModel.create(newTransaction);

        return NextResponse.json({ success: true, data: { transaction } });
    } catch (error) {
        console.error('Error fetching wallet:', error);
        return NextResponse.json({ error: 'Failed to fetch wallet' }, { status: 500 });
    }
}