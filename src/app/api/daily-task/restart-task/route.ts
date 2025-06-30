import { NextRequest, NextResponse } from 'next/server';
import { DailyTaskModel } from '@/models/DailyTask';
import { authOptions } from '@/config';
import { getServerSession } from 'next-auth';

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { taskId } = await request.json();

        const task = await DailyTaskModel.findById(taskId);

        if (!task) {
            return NextResponse.json({ error: 'Task not found' }, { status: 404 });
        }

        if (task?.isCompleted) {
            return NextResponse.json({ error: 'Task is already completed' }, { status: 400 });
        }

        return NextResponse.json({ success: true, data: task });
    } catch {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }


}