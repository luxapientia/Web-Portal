import { NextResponse } from 'next/server';
import { User, UserModel } from '@/models/User';
import { ActivityLog, ActivityLogModel } from '@/models/ActivityLog';
import { ObjectId } from 'mongodb';
import { authOptions } from '@/config';
import { getServerSession } from 'next-auth';
import { TrustFund, TrustFundModel } from '@/models/TrustFund';
import { getAccountValue } from '@/controllers';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await UserModel.findOne({ _id: new ObjectId(session.user.id) }) as User;
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const lockedFunds = await TrustFundModel.find({ userId: user.id, endDate: { $gt: new Date() } }) as TrustFund[];
        const accountValue = await getAccountValue(user.id);
        const totalLockedFunds = lockedFunds.reduce((acc, fund) => acc + fund.amount, 0);
        const totalAvailableFunds = accountValue - totalLockedFunds;

        return NextResponse.json({ success: true, data: { lockedFunds, totalAvailableFunds } });
    } catch (error) {
        console.error('Team members error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}