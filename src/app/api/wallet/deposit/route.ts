import { NextRequest, NextResponse } from 'next/server';
import { Transaction, TransactionModel } from '@/models/Transaction';
import { authOptions, config } from '@/config';
import { getServerSession } from 'next-auth';
import { UserModel } from '@/models/User';
import { User } from '@/models/User';
import { DepositWalletModel, DepositWalletWithoutKeys } from '@/models/DepositWallet';

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

        const depositWallets = await DepositWalletModel.find({userId: session.user.id}) as DepositWalletWithoutKeys[];

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

        await DepositWalletModel.updateOne({ address: walletAddress, chain: chain, userId: user._id }, { $set: { available: false } });

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