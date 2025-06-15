import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { TransactionModel } from '@/models/Transaction';
import { UserModel } from '@/models/User';
import { authOptions } from '@/config';
import { getServerSession } from 'next-auth';
import { User } from '@/models/User';
import { WalletModel } from '@/models/Wallet';

export async function POST(request: NextRequest) {
    try {
        // Get user data from request headers (set by middleware)
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await UserModel.findOne({ email: session.user.email }) as User;    
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Parse request body
        const body = await request.json();
        const { chain, token, amount, toAddress } = body;

        // Validate required fields
        if (!chain || !token || !amount || !toAddress) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Validate amount format
        if (typeof amount !== 'number' || amount <= 0) {
            return NextResponse.json(
                { success: false, error: 'Invalid amount' },
                { status: 400 }
            );
        }

        // Check if user has sufficient withdrawable balance
        if (amount > user.accountValue.totalWithdrawable) {
            return NextResponse.json(
                { success: false, error: 'Insufficient withdrawable balance' },
                { status: 400 }
            );
        }

        const fromWallet = await WalletModel.findOne({chain: chain });
        if (!fromWallet) {
            return NextResponse.json(
                { success: false, error: 'Central wallet not found' },
                { status: 400 }
            );
        }

        // Create new transaction
        const transaction = await TransactionModel.create({
            transactionId: 'not-set',
            fromUserId: user._id,
            type: 'withdraw',
            status: 'requested',
            amountInUSD: amount,
            token: token,
            chain: chain,
            fromAddress: fromWallet.address,
            toAddress: toAddress,
            remarks: `${user.name} requested a withdraw of ${amount} ${token} from ${chain} chain`,
            startDate: new Date()
        });

        return NextResponse.json({
            success: true,
            message: 'Withdraw request submitted successfully',
            data: {
                transactionId: transaction._id,
                status: transaction.status
            }
        });

    } catch (error) {
        console.error('Error processing withdraw request:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to process withdraw request' },
            { status: 500 }
        );
    }
}
