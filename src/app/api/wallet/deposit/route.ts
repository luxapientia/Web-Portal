import { NextRequest, NextResponse } from 'next/server';
import { Wallet, WalletModel, WalletWithoutKeys } from '@/models/Wallet';
import { TransactionModel } from '@/models/Transaction';
import { authOptions, config } from '@/config';
import { getServerSession } from 'next-auth';
import { walletService } from '@/services/Wallet';
import { TransactionDetails } from '@/services/Wallet';

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { chain, token, transactionId, fromAddress, toAddress } = await request.json();

        const wallet = await WalletModel.findOne({ address: toAddress });

        if (!wallet) {
            return NextResponse.json({ error: 'Wallet not found' }, { status: 404 });
        }

        if (await TransactionModel.findOne({ transactionId })) {
            return NextResponse.json({ error: 'Transaction already exists' }, { status: 400 });
        }

        const txDetails = await walletService.getTxDetails(transactionId, chain);

        if (txDetails.status === 'notStarted') {
            return NextResponse.json({ error: 'Transaction not started' }, { status: 400 });
        }

        const transaction = await TransactionModel.create({
            transactionId,
            fromAddress: txDetails.fromAddress,
            toAddress: txDetails.toAddress,
            status: txDetails.status,
            type: 'deposit',
            amount: txDetails.amount,
            startDate: new Date(),
            releaseDate: txDetails.confirmedAt,
            remarks: 'Deposit'
        });

        return NextResponse.json({ success: true, data: { transaction } });
    } catch (error) {
        console.error('Error fetching wallet:', error);
        return NextResponse.json({ error: 'Failed to fetch wallet' }, { status: 500 });
    }
}