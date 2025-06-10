import { NextRequest, NextResponse } from 'next/server';
import { UserModel } from '@/models/User';
import { authOptions } from '../auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import { Plan, PlanModel } from '@/models/Plan';

export const getVipLevel = async (userId: string): Promise<Plan> => {
    const user = await UserModel.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }
    let accountValue: number = await getAccountValue(userId);

    if (!accountValue) {
        accountValue = 0;
    }

    const plans = await PlanModel.find({}) as Plan[];

    const vipLevel = plans.find(plan => plan.account_value_start_usd <= accountValue && plan.account_value_end_usd >= accountValue);

    if (!vipLevel) {
        throw new Error('VIP level not found');
    }

    return vipLevel;
}

export const getAccountValue = async (userId: string): Promise<number> => {
    // const user = await UserModel.findById(userId);
    // if (!user) {
    //     throw new Error('User not found');
    // }

    // return user.accountValue;
    return 0;
}

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await UserModel.findById(session.user.id);
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const accountValue = await getAccountValue(user?.id);
        const vipLevel = await getVipLevel(user?.id);

        return NextResponse.json({
            accountValue: accountValue,
            vipLevel: vipLevel,
        });
    } catch (error) {
        console.error('Error getting account asset:', error);
        return NextResponse.json({ error: 'Failed to get account asset'  }, { status: 500 });
    }
} 