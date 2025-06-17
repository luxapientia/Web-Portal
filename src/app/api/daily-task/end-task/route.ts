import { NextRequest, NextResponse } from 'next/server';
import { UserModel } from '@/models/User';
import { DailyTaskModel } from '@/models/DailyTask';
import { authOptions } from '@/config';
import { getServerSession } from 'next-auth';
import { getDailyTaskReward, getVipLevel } from '@/controllers';

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { taskId } = await request.json();

        const user = await UserModel.findById(session.user.id);

        const vipLevel = await getVipLevel(user?.id);

        const task = await DailyTaskModel.findByIdAndUpdate(taskId, { isCompleted: true });

        if (!task) {
            return NextResponse.json({ error: 'Task not found' }, { status: 404 });
        }

        const tasks = await DailyTaskModel.find({ userId: user?.id});

        await getDailyTaskReward(user?.id, vipLevel.dailyTasksRewardPercentage / vipLevel.dailyTasksCountAllowed);

        return NextResponse.json({
            success: true,
            data: {
                reward: vipLevel.dailyTasksRewardPercentage / vipLevel.dailyTasksCountAllowed,
                tasks
            }
        });
    } catch {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }


}