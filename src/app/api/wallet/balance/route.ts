import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { WalletTransactionModel } from '@/models/Wallet';

/**
 * GET /api/wallet/balance
 * Get the total balance from the wallet collection
 * Uses the balance from the last transaction history
 */
export async function GET(request: NextRequest) {
    try {
        // Get user data from request headers (set by middleware)
        const userHeader = request.headers.get('user');
        if (!userHeader) {
            return NextResponse.json({ error: 'User data not found' }, { status: 401 });
        }

        const userData = JSON.parse(userHeader);
        const userId = userData.id;

        // If no wallet balance record exists, get the last transaction to determine balance
        const lastTransaction = await WalletTransactionModel
            .find({ userId: new ObjectId(userId) })
            .sort({ createdAt: -1 })
            .limit(1)
            .lean();

        if (lastTransaction.length > 0 && lastTransaction[0].balance !== undefined) {
            return NextResponse.json({
                success: true,
                balance: lastTransaction[0].balance ?? 0
            });
        } else {
            return NextResponse.json({
                success: true,
                balance: 0
            });
        }


    } catch (error) {
        console.error('Error fetching wallet balance:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch wallet balance' },
            { status: 500 }
        );
    }
}