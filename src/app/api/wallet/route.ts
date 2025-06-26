import { NextResponse } from 'next/server';
import { CentralWallet, CentralWalletModel } from '@/models/CentralWallet';
import { authOptions, config } from '@/config';
import { getServerSession } from 'next-auth';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const wallets = await CentralWalletModel.find({}) as CentralWallet[];

        const centralWallets: { address: string, chain: string }[] = [];

        const supportedChains = Object.keys(config.wallet.supportedChains).map(chain => {
            const ws = wallets.filter(wallet => wallet.chain === chain);
            if (ws.length > 0) {
                const idx = Math.floor(Math.random() * ws.length);
                const centralWallet = ws[idx];
                centralWallets.push({
                    address: centralWallet.address,
                    chain: centralWallet.chain,
                });
            }
            const tokens = config.wallet.supportedChains[chain as keyof typeof config.wallet.supportedChains].supportedTokens.map(val => val.token);
            return {
                chain: chain,
                tokens: tokens
            };
        });

        console.log(supportedChains)

        return NextResponse.json({ success: true, data: { walletAddresses: centralWallets, supportedChains: [{ chain: 'Tron', tokens: ['USDT', 'USDC'] }] } });
    } catch (error) {
        console.error('Error fetching wallet:', error);
        return NextResponse.json({ error: 'Failed to fetch wallet' }, { status: 500 });
    }
}