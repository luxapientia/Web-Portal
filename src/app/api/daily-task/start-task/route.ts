import { NextRequest, NextResponse } from 'next/server';
import { UserModel } from '@/models/User';
import { DailyTaskModel } from '@/models/DailyTask';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import { getFormattedDate } from '@/utils/date-format';
import { getVipLevel } from '@/app/api/account-asset/route';

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await UserModel.findById(session.user.id);
        const currentDate = getFormattedDate();

        const taskDone = (await DailyTaskModel.find({ date: currentDate, userId: user?.id }));

        const vipLevel = await getVipLevel(user?.id);
        const taskLimit = vipLevel.daily_tasks_count_allowed;

        if (taskDone.length >= taskLimit) {
            return NextResponse.json({ error: 'Task limit reached' }, { status: 400 });
        }

        const newTask = new DailyTaskModel({
            date: currentDate,
            userId: user?.id,
            vipLevel: vipLevel.plan_name,
            taskIndex: taskDone.length + 1,
            isCompleted: false
        });

        await newTask.save();

        const tasks = await DailyTaskModel.find({ userId: user?.id});


        return NextResponse.json({
            success: true,
            data: {
                taskLimit,
                remainingTasks: taskLimit - taskDone.length - 1,
                task: newTask,
                tasks
            }
        });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }


}