import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/config';
import { TransactionModel } from '@/models/Transaction';

export async function GET(req: NextRequest) {
    try {
        // Check authentication and admin status
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const role = session.user.role;
        if (role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }


        // Get query parameters
        const searchParams = req.nextUrl.searchParams;
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const transactionId = searchParams.get('transactionId');
        const userName = searchParams.get('userName');
        const status = searchParams.get('status');
        const startDate = searchParams.get('startDate');
        const sortBy = searchParams.get('sortBy');
        const sortOrder = searchParams.get('sortOrder');

        // Build query
        const query: any = {
            type: 'withdraw', // Only get withdrawal transactions
        };

        if (transactionId) {
            query.transactionId = { $regex: transactionId, $options: 'i' };
        }

        if (userName) {
            query['fromUserId.name'] = { $regex: userName, $options: 'i' };
        }

        if (status && status !== 'all') {
            query.status = status;
        }

        if (startDate) {
            query.startDate = { $gte: new Date(startDate) };
        }

        // Build sort object
        const sortOptions: any = {};
        if (sortBy && sortOrder) {
            sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;
        } else {
            // Default sort by startDate descending
            sortOptions.startDate = -1;
        }

        // Execute query with pagination
        const skip = (page - 1) * limit;

        const [transactions, total] = await Promise.all([
            TransactionModel.find(query)
                .sort(sortOptions)
                .skip(skip)
                .limit(limit)
                .populate('fromUserId')
                .lean(),
            TransactionModel.countDocuments(query)
        ]);

        return NextResponse.json({
            success: true,
            data: {
                data: transactions,
                total,
                page,
                limit
            }
        });

    } catch (error) {
        console.error('Error in GET /api/admin/withdrawals:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}