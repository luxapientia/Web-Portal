import { NextRequest, NextResponse } from 'next/server';
import { User, UserModel } from '@/models/User';
import { authOptions } from '@/config';
import { getServerSession } from 'next-auth';
import { TrustFund, TrustFundModel } from '@/models/TrustFund';
import { TrustPlan, TrustPlanModel } from '@/models/TrustPlan';

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await UserModel.findById(session.user.id) as User;
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const body = await request.json();
        const { planId, fundValue } = body;

        console.log(planId, fundValue);

        const trustPlan = await TrustPlanModel.findById(planId) as TrustPlan;
        if (!trustPlan) {
            return NextResponse.json({ error: 'Trust plan not found' }, { status: 404 });
        }

        const trustFund = await TrustFundModel.create({
            userId: user.id,
            trustPlanId: trustPlan.id,
            amount: fundValue,
            startDate: new Date(),
            endDate: new Date(new Date().getTime() + trustPlan.duration * 24 * 60 * 60 * 1000),
            dailyInterestRate: trustPlan.dailyInterestRate,
            released: false
        }) as TrustFund;

        user.accountValue.totalWithdrawable -= fundValue;
        await user.save();
        return NextResponse.json({ success: true, data: { trustFund } });
    } catch (error) {
        console.error('Team members error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}