import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/config';
import { Transaction, TransactionModel } from '@/models/Transaction';
import { User, UserModel } from '@/models/User';
import { AppConfig, AppConfigModel } from '@/models/AppConfig';
import { transfer } from '@/controllers';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await UserModel.findById(session.user.id) as User;

        const app_config = await AppConfigModel.findOne({}) as AppConfig;
        if (!app_config) {
            return NextResponse.json({ error: 'App config not found' }, { status: 500 });
        }

        const transferFee = app_config.transfer_fee;
        const dailyTransferMaxLimit = app_config.dailyTransferMaxLimit;
        const dailyNumOfTransferLimit = app_config.dailyNumOfTransferLimit;
        const todayTransferTransactions = await TransactionModel.find({
            fromUserId: user._id,
            type: 'transfer',
            releaseDate: {
                $gte: new Date(new Date().setHours(0, 0, 0, 0)),
                $lt: new Date(new Date().setHours(23, 59, 59, 999))
            }
        }) as Transaction[];

        const availableTransferCount = dailyNumOfTransferLimit - todayTransferTransactions.length;

        const currentWithdrawTransactions = await TransactionModel.find({
            fromUserId: user._id,
            type: 'withdraw',
            $or: [
                { releaseDate: { $exists: false } },
                { releaseDate: { $gte: new Date() } }
            ]
        }) as Transaction[];

        const transferable = availableTransferCount >= 0 && currentWithdrawTransactions.length == 0;

        const transferableAmount = user.accountValue.totalWithdrawable - transferFee;

        return NextResponse.json({
            success: true,
            data: {
                transferFee,
                dailyTransferMaxLimit,
                dailyNumOfTransferLimit,
                availableTransferCount,
                transferable,
                transferableAmount
            }
        });
    } catch {
        return NextResponse.json(
            { success: false, error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await UserModel.findById(session.user.id) as User;

        const { recipientEmail, amount, note } = await request.json();

        const recipientUser = await UserModel.findOne({ email: recipientEmail }) as User;
        if (!recipientUser) {
            return NextResponse.json({ error: 'Recipient not found' }, { status: 404 });
        }

        const app_config = await AppConfigModel.findOne({}) as AppConfig;
        if (!app_config) {
            return NextResponse.json({ error: 'App config not found' }, { status: 500 });
        }

        const transferFee = app_config.transfer_fee;
        const dailyTransferMaxLimit = app_config.dailyTransferMaxLimit;
        const dailyNumOfTransferLimit = app_config.dailyNumOfTransferLimit;
        const todayTransferTransactions = await TransactionModel.find({
            fromUserId: user._id,
            type: 'transfer',
            releaseDate: {
                $gte: new Date(new Date().setHours(0, 0, 0, 0)),
                $lt: new Date(new Date().setHours(23, 59, 59, 999))
            }
        }) as Transaction[];

        const availableTransferCount = dailyNumOfTransferLimit - todayTransferTransactions.length;

        const currentWithdrawTransactions = await TransactionModel.find({
            fromUserId: user._id,
            type: 'withdraw',
            $or: [
                { releaseDate: { $exists: false } },
                { releaseDate: { $gte: new Date() } }
            ]
        }) as Transaction[];


        const transferableAmount = user.accountValue.totalAssetValue - user.accountValue.totalInTrustFund - transferFee;

        const transferable = availableTransferCount >= 0 && currentWithdrawTransactions.length == 0 && amount <= dailyTransferMaxLimit && amount <= transferableAmount;

        if (transferable) {
            await TransactionModel.create({
                fromUserId: user._id,
                toUserId: recipientUser._id,
                amountInUSD: amount,
                type: 'transfer',
                remark: note,
                startDate: new Date(),
                releaseDate: new Date(),
                status: 'success',
            })
            await transfer(user._id, recipientUser._id, amount, transferFee);
            return NextResponse.json({
                success: true,
            })
        } else {
            return NextResponse.json({
                success: false,
                error: 'Transfer not available'
            })
        }
    } catch {
        return NextResponse.json(
            { success: false, error: 'Failed to process transfer' },
            { status: 500 }
        );
    }
} 