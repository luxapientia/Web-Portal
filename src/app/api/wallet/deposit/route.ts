import { NextRequest, NextResponse } from 'next/server';
import { Wallet, WalletModel, WalletWithoutKeys } from '@/models/Wallet';
import { TransactionModel } from '@/models/Transaction';
import { authOptions, config } from '@/config';
import { getServerSession } from 'next-auth';
import { walletService } from '@/services/Wallet';
import { TransactionDetails } from '@/services/Wallet';
import { UserModel } from '@/models/User';
import { User } from '@/models/User';
import { CryptoPriceModel } from '@/models/CryptoPrice';

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await UserModel.findOne({ email: session.user.email }) as User;    
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
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

        const cryptoPrice = await CryptoPriceModel.find({ symbol: token }).sort({ timestamp: -1 }).limit(1);

        const newTransaction: any = {
            transactionId,
            fromAddress: txDetails.fromAddress,
            toAddress: txDetails.toAddress,
            status: txDetails.status,
            type: 'deposit',
            amount: txDetails.amount,
            startDate: new Date(),
            releaseDate: txDetails.confirmedAt,
            remarks: `${user.name} deposited ${txDetails.amount} ${token} from ${txDetails.fromAddress} to ${txDetails.toAddress}`,
            token: token,
            chain: chain,
            fromUserId: user._id,
        }

        if (txDetails.amount) {
            newTransaction.amountInUSD = txDetails.amount * (cryptoPrice[0]?.price || 1);
        }

        const transaction = await TransactionModel.create(newTransaction);

        return NextResponse.json({ success: true, data: { transaction } });
    } catch (error) {
        console.error('Error fetching wallet:', error);
        return NextResponse.json({ error: 'Failed to fetch wallet' }, { status: 500 });
    }
}