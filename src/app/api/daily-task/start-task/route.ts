import { NextResponse } from 'next/server';
import { UserModel } from '@/models/User';
import { DailyTaskModel } from '@/models/DailyTask';
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

        const taskDone = (await DailyTaskModel.find({ date: currentDate, userId: user?.id }));

        const vipLevel = await getVipLevel(user?.id);
        const taskLimit = vipLevel.dailyTasksCountAllowed;

        if (taskDone.length >= taskLimit) {
            return NextResponse.json({ error: 'Task limit reached' }, { status: 400 });
        }

        const newTask = new DailyTaskModel({
            date: currentDate,
            userId: user?.id,
            vipLevel: vipLevel.name,
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
    } catch {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }


}