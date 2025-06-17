import { NextResponse } from 'next/server';
import { UserModel } from '@/models/User';
import { ActivityLog, ActivityLogModel } from '@/models/ActivityLog';
import { authOptions } from '@/config';
import { getServerSession } from 'next-auth';
import { getVipLevel } from '@/controllers';
import { InterestReward, InterestRewardModel } from '@/models/InterestReward';


export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await UserModel.findById(session.user.id);
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const accountValue = user.accountValue.totalAssetValue;
        const vipLevel = await getVipLevel(user?.id);
        const earningTodayLogs = await InterestRewardModel.find({
            userId: user?.id,
            startDate: {
                $gte: new Date(new Date().setHours(0, 0, 0, 0)),
                $lt: new Date(new Date().setHours(23, 59, 59, 999))
            }
        }) as InterestReward[];

        const totalDepositLogs = await ActivityLogModel.find({
            userId: user?.id,
            type: 'deposit'
        }) as ActivityLog[];

        const totalWithdrawLogs = await ActivityLogModel.find({
            userId: user?.id,
            type: 'withdraw'
        }) as ActivityLog[];

        const profit = accountValue - totalDepositLogs.reduce((acc, log) => acc + log.amount, 0) + totalWithdrawLogs.reduce((acc, log) => acc + log.amount, 0);

        return NextResponse.json({
            accountValue: accountValue,
            profit: profit,
            earningToday: earningTodayLogs.reduce((acc, log) => acc + log.amount, 0),
            totalDeposit: totalDepositLogs.reduce((acc, log) => acc + log.amount, 0),
            vipLevel: vipLevel,
        });
    } catch (error) {
        console.error('Failed to get account asset', error);
        return NextResponse.json({ error: 'Failed to get account asset'  }, { status: 500 });
    }
} 


