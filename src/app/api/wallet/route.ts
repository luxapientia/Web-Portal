import { NextResponse } from 'next/server';
import { WithdrawWallet, WithdrawWalletModel, WithdrawWalletWithoutKeys } from '@/models/WithdrawWallet';
import { authOptions, config } from '@/config';
import { getServerSession } from 'next-auth';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const wallet = await WithdrawWalletModel.find({}) as WithdrawWallet[];

        const walletWithoutKeys = wallet.map(w => ({
            address: w.address,
            chain: w.chain,
        })) as WithdrawWalletWithoutKeys[];

        const supportedChains = Object.keys(config.wallet.supportedChains).map(chain => {
            const tokens = config.wallet.supportedChains[chain as keyof typeof config.wallet.supportedChains].supportedTokens.map(val => val.token);
            return {
                chain: chain,
                tokens: tokens
            };
        });

        return NextResponse.json({ success: true, data: { walletAddresses: walletWithoutKeys, supportedChains } });
    } catch (error) {
        console.error('Error fetching wallet:', error);
        return NextResponse.json({ error: 'Failed to fetch wallet' }, { status: 500 });
    }
}