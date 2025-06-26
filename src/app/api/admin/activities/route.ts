import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { ActivityLogModel, ActivityLogWithRef } from "@/models/ActivityLog";
import { authOptions } from '@/config';

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ success: false, data: { error: 'Unauthorized' } }, { status: 401 });
        }

        // Get query parameters
        const searchParams = req.nextUrl.searchParams;
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const type = searchParams.get('type') || undefined;
        const startDate = searchParams.get('startDate') || undefined;
        const endDate = searchParams.get('endDate') || undefined;

        // Build query
        const query: any = {};
        if (type) query.type = type;
        if (startDate || endDate) {
            query.timestamp = {};
            if (startDate) query.timestamp.$gte = new Date(startDate);
            if (endDate) query.timestamp.$lte = new Date(endDate);
        }

        // Get total count for pagination
        const total = await ActivityLogModel.countDocuments(query);

        // Fetch activities with pagination and populate user details
        const activities = await ActivityLogModel.find(query)
            .sort({ timestamp: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .populate('userId', 'email name avatar')
            .populate('toUserId', 'email name avatar')
            .lean();

        return NextResponse.json({
            success: true,
            data: {
                activities,
                pagination: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit)
                }
            }
        });

    } catch (error) {
        console.error('Error fetching activities:', error);
        return NextResponse.json(
            { success: false, data: { error: 'Failed to fetch activities' } },
            { status: 500 }
        );
    }
} 