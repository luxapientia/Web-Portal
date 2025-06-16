import { NextResponse } from 'next/server';
import { User, UserModel } from '@/models/User';
import { authOptions } from '@/config';
import { getServerSession } from 'next-auth';
import { TrustFund, TrustFundModel } from '@/models/TrustFund';
import { Transaction, TransactionModel } from '@/models/Transaction';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await UserModel.findById(session.user.id) as User;
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const lockedFunds = await TrustFundModel.find({ userId: user.id, released: false }) as TrustFund[];
        const totalAvailableFunds = user.accountValue.totalWithdrawable;

        const currentWithdrawTransactions = await TransactionModel.find({
            fromUserId: user._id,
            type: 'withdraw',
            $or: [
                { releaseDate: { $exists: false } },
                { releaseDate: { $gte: new Date() } }
            ]
        }) as Transaction[];

        const trustFundable = currentWithdrawTransactions.length == 0 && totalAvailableFunds > 0;

        return NextResponse.json({ success: true, data: { lockedFunds, totalAvailableFunds, trustFundable } });
    } catch (error) {
        console.error('Team members error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}