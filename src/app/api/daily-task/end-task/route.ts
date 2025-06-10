import { NextRequest, NextResponse } from 'next/server';
import { UserModel } from '@/models/User';
import { DailyTaskModel } from '@/models/DailyTask';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import { getFormattedDate } from '@/utils/date-format';
import { getVipLevel } from '@/app/api/account-asset/route';

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

        return NextResponse.json({
            success: true,
            data: {
                reward: vipLevel.daily_tasks_reward_usd,
                tasks
            }
        });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }


}