import { NextResponse } from 'next/server';
import { InterestMatrixModel } from '@/models/InterestMatrix';

export async function GET() {
    try {
        const matrices = await InterestMatrixModel.find({})
            .sort({ level: 1 })
            .select({
                level: 1,
                name: 1,
                startAccountValue: 1,
                endAccountValue: 1,
                startActiveMembers: 1,
                endActiveMembers: 1,
                promotionReward: 1,
                uplineDepositReward: 1,
                dailyTasksCountAllowed: 1,
                dailyTasksRewardPercentage: 1
            });

        if (!matrices || matrices.length === 0) {
            return NextResponse.json(
                { success: false, error: 'No VIP levels found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ 
            success: true, 
            data: matrices 
        });
    } catch (error) {
        console.error('Error fetching VIP levels:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch VIP levels' },
            { status: 500 }
        );
    }
}
