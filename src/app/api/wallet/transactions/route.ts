import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/config';
import { Transaction, TransactionModel } from '@/models/Transaction';
import { UserModel } from '@/models/User';
import { FilterQuery } from 'mongoose';

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await UserModel.findOne({ email: session.user.email });
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Get query parameters
        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get('page') || '0');
        const limit = parseInt(searchParams.get('limit') || '10');
        const type = searchParams.get('type');
        const status = searchParams.get('status');
        const token = searchParams.get('token');
        const sortField = searchParams.get('sortField') || 'createdAt';
        const sortOrder = searchParams.get('sortOrder') || 'desc';

        // Build query
        const query: FilterQuery<Transaction> = {
            $or: [
                { fromUserId: user._id },
                { toUserId: user._id }
            ]
        };

        if (type && type !== 'all') {
            query.type = type;
        }

        if (status && status !== 'all') {
            query.status = status;
        }

        if (token && token !== 'all') {
            query.token = token;
        }

        // Get total count for pagination
        const total = await TransactionModel.countDocuments(query);

        // Build sort object
        const sort: FilterQuery<Transaction> = {};
        sort[sortField] = sortOrder === 'asc' ? 1 : -1;

        // Get transactions with pagination and sorting
        const transactions = await TransactionModel
            .find(query)
            .sort(sort)
            .skip(page * limit)
            .limit(limit)
            .populate('fromUserId')
            .populate('toUserId');

        return NextResponse.json({
            success: true,
            data: {
                transactions,
                total,
                page,
                limit,
                sortField,
                sortOrder
            }
        });

    } catch (error) {
        console.error('Error fetching transactions:', error);
        return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
    }
} 