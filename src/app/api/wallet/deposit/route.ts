import { NextRequest, NextResponse } from 'next/server';
import { CentralWallet, CentralWalletModel } from '@/models/CentralWallet';
import { Transaction, TransactionModel } from '@/models/Transaction';
import { authOptions, config } from '@/config';
import { getServerSession } from 'next-auth';
import { walletService } from '@/services/Wallet';
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

        const { chain, token, toAddress } = await request.json();

        const wallet = await CentralWalletModel.findOne({ address: toAddress, chain }) as CentralWallet;

        if (!wallet) {
            return NextResponse.json({ error: 'Wallet not found' }, { status: 404 });
        }

        if (wallet.isInUse) {
            return NextResponse.json({ error: 'Wallet is already in use' }, { status: 400 });
        }

        const startAmount = await walletService.getBalance(toAddress, chain, token);
        wallet.startAmount = startAmount;
        wallet.isInUse = true;
        await wallet.save();

        const newTransaction: Partial<Transaction> = {
            toAddress: toAddress,
            type: 'deposit',
            startDate: new Date(),
            token: token,
            chain: chain,
            fromUserId: user._id,
        }

        const transaction = await TransactionModel.create(newTransaction);

        return NextResponse.json({ success: true, data: { transaction } });
    } catch (error) {
        console.error('Error fetching wallet:', error);
        return NextResponse.json({ error: 'Failed to fetch wallet' }, { status: 500 });
    }
}

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await UserModel.findOne({ email: session.user.email }) as User;
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const pendingDepositTransactions = await TransactionModel.findOne({
            fromUserId: user._id,
            status: 'pending',
            type: 'deposit'
        }) as Transaction

        let pendingDepositWallet: CentralWallet | null = null;

        if (pendingDepositTransactions) {
            pendingDepositWallet = await CentralWalletModel.findOne({
                address: pendingDepositTransactions.toAddress,
                chain: pendingDepositTransactions.chain
            }) as CentralWallet;
        }

        const wallets = await CentralWalletModel.find({ isInUse: false }) as CentralWallet[];

        const centralWallets: { address: string, chain: string }[] = [];

        const supportedChains: { chain: string, tokens: string[] }[] = [];
        Object.keys(config.wallet.supportedChains).map(chain => {
            const ws = wallets.filter(wallet => wallet.chain === chain);
            console.log(ws)
            if (ws.length > 0) {
                const idx = Math.floor(Math.random() * ws.length);
                const centralWallet = ws[idx];
                centralWallets.push({
                    address: centralWallet.address,
                    chain: centralWallet.chain,
                });
                const tokens = config.wallet.supportedChains[chain as keyof typeof config.wallet.supportedChains].supportedTokens.map(val => val.token);
                supportedChains.push({
                    chain: chain,
                    tokens: tokens
                });
            }
        });
        console.log(supportedChains)

        return NextResponse.json({ success: true, data: { walletAddresses: centralWallets, supportedChains, pendingDepositWallet: pendingDepositWallet } });
    } catch (error) {
        console.error('Error fetching wallet:', error);
        return NextResponse.json({ error: 'Failed to fetch wallet' }, { status: 500 });
    }
}