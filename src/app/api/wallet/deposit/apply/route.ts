import { NextRequest, NextResponse } from 'next/server';
import { CentralWallet, CentralWalletModel } from '@/models/CentralWallet';
import { Transaction, TransactionModel } from '@/models/Transaction';
import { authOptions } from '@/config';
import { getServerSession } from 'next-auth';
import { UserModel } from '@/models/User';
import { User } from '@/models/User';

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

        const { chain, token } = await request.json();

        const wallets = await CentralWalletModel.find({ chain }) as CentralWallet[];

        if (wallets.length === 0) {
            return NextResponse.json({ error: 'No wallet found with this chain' }, { status: 404 });
        }

        const wallet = wallets[Math.floor(Math.random() * wallets.length)];

        wallet.isInUse = true;

        const newTransaction: Partial<Transaction> = {
            toAddress: wallet.address,
            type: 'deposit',
            startDate: new Date(),
            token: token,
            chain: chain,
            fromUserId: user._id,
        }

        await TransactionModel.create(newTransaction);
        await wallet.save();

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error fetching wallet:', error);
        return NextResponse.json({ error: 'Failed to fetch wallet' }, { status: 500 });
    }
}