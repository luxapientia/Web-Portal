import { NextResponse } from 'next/server';
import { UserModel } from '@/models/User';
import { DailyTask, DailyTaskModel } from '@/models/DailyTask';
import { authOptions } from '@/config';
import { getServerSession } from 'next-auth';
import { getFormattedDate } from '@/utils/date-format';
import { getVipLevel } from '@/controllers';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await UserModel.findById(session.user.id);
        const currentDate = getFormattedDate();

        const taskDone = (await DailyTaskModel.find({ date: currentDate, userId: user?.id })) as DailyTask[];

        const vipLevel = await getVipLevel(user?.id);
        const taskLimit = vipLevel.daily_tasks_count_allowed;


        return NextResponse.json({
            success: true,
            data: {
                taskLimit,
                remainingTasks: taskLimit - taskDone.length,
                tasks: taskDone
            }
        });
    } catch {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}