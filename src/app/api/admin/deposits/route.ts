import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/config';
import { Transaction, TransactionModel } from '@/models/Transaction';
import { FilterQuery } from 'mongoose';

export async function GET(request: NextRequest) {
    try {
        // Check admin authentication
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get query parameters
        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const transactionId = searchParams.get('transactionId');
        const fromAddress = searchParams.get('fromAddress');
        const toAddress = searchParams.get('toAddress');
        const status = searchParams.get('status');
        const startDate = searchParams.get('startDate');
        const sortBy = searchParams.get('sortBy');
        const sortOrder = searchParams.get('sortOrder');

        const query: FilterQuery<Transaction> = { type: 'deposit' };
        // Build filter query

        if (transactionId) {
            query.transactionId = { $regex: transactionId, $options: 'i' };
        }
        if (fromAddress) {
            query.fromAddress = { $regex: fromAddress, $options: 'i' };
        }
        if (toAddress) {
            query.toAddress = { $regex: toAddress, $options: 'i' };
        }
        if (status) {
            query.status = status;
        }
        if (startDate) {
            const date = new Date(startDate);
            query.startDate = {
                $gte: new Date(date.setHours(0, 0, 0, 0)),
                $lt: new Date(date.setHours(23, 59, 59, 999))
            };
        }

        // Build sort query
        const sortQuery: FilterQuery<Transaction> = {};
        if (sortBy && sortOrder) {
            sortQuery[sortBy] = sortOrder === 'asc' ? 1 : -1;
        } else {
            // Default sort by startDate descending
            sortQuery.startDate = -1;
        }

        // Execute query with pagination
        const skip = (page - 1) * limit;
            
        
        const [transactions, total] = await Promise.all([
            TransactionModel
                .find(query)
                .populate('fromUserId')
                .populate('toUserId')
                .sort(sortQuery)
                .skip(skip)
                .limit(limit)
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
        console.error('Error in deposits API:', error);
        return NextResponse.json(
            { error: 'Failed to fetch deposits' },
            { status: 500 }
        );
    }
}

// // Optional: Add POST endpoint for admin actions on deposits if needed
// export async function POST(request: NextRequest) {
//     try {
//         // Check admin authentication
//         const session = await getServerSession(authOptions);
//         if (!session?.user?.email) {
//             return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//         }

//         const { action, id, reason } = await request.json();

//         if (!action || !id) {
//             return NextResponse.json(
//                 { error: 'Missing required fields' },
//                 { status: 400 }
//             );
//         }

//         const transaction = await TransactionModel.findById(id);

//         if (!transaction) {
//             return NextResponse.json(
//                 { error: 'Transaction not found' },
//                 { status: 404 }
//             );
//         }

//         // Handle different actions
//         switch (action) {
//             case 'approve':
//                 if (transaction.status !== 'in_review') {
//                     return NextResponse.json(
//                         { error: 'Transaction is not in review state' },
//                         { status: 400 }
//                     );
//                 }
//                 transaction.status = 'success';
//                 transaction.releaseDate = new Date();
//                 break;

//             case 'reject':
//                 if (transaction.status !== 'in_review') {
//                     return NextResponse.json(
//                         { error: 'Transaction is not in review state' },
//                         { status: 400 }
//                     );
//                 }
//                 if (!reason?.trim()) {
//                     return NextResponse.json(
//                         { error: 'Rejection reason is required' },
//                         { status: 400 }
//                     );
//                 }
//                 transaction.status = 'rejected';
//                 transaction.rejectionReason = reason.trim();
//                 break;

//             default:
//                 return NextResponse.json(
//                     { error: 'Invalid action' },
//                     { status: 400 }
//                 );
//         }

//         await transaction.save();

//         return NextResponse.json({
//             success: true,
//             data: transaction
//         });

//     } catch (error) {
//         console.error('Error in deposits API:', error);
//         return NextResponse.json(
//             { error: 'Failed to process deposit action' },
//             { status: 500 }
//         );
//     }
// }
