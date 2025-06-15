import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/config';
import { TransactionModel, Transaction } from '@/models/Transaction';

export async function POST(req: NextRequest) {
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

        const { id, reason } = await req.json();

        const transaction = await TransactionModel.findById(id) as Transaction;

        if (!transaction) {
            return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
        }

        transaction.status = 'rejected';
        transaction.rejectReason = reason;
        await transaction.save();

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Error in GET /api/admin/withdrawals/approve:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}