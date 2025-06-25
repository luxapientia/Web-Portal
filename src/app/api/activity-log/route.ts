import { NextResponse } from 'next/server';
import { ActivityLogModel } from '@/models/ActivityLog';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/config';

export async function GET() {
    try {
        // Get the current session
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get today's start (00:00:00) and end (23:59:59) timestamps
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Fetch today's activity logs
        const activityLogs = await ActivityLogModel
            .find({
                timestamp: {
                    $gte: today,
                    $lt: tomorrow
                }
            })
            .sort({ timestamp: -1 })
            .limit(10)
            .lean();

        return NextResponse.json(activityLogs);
    } catch (error) {
        console.error('Error fetching activity logs:', error);
        return NextResponse.json(
            { error: 'Failed to fetch activity logs' },
            { status: 500 }
        );
    }
} 