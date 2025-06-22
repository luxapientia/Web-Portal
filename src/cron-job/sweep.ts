import cron from 'node-cron';
import { DepositWallet, DepositWalletModel } from '../models/DepositWallet';
import { GasWallet, GasWalletModel } from '../models/GasWallet';
import { walletService } from '../services/Wallet';
import { decryptPrivateKey } from '../utils/encrypt';

async function checkDepositWallet() {
    const depositWallets = await DepositWalletModel.find({
        deposited: true,
        sweeped: false
    }) as DepositWallet[];
    const gasWallets = await GasWalletModel.find({}) as GasWallet[];
    console.log(`[${new Date().toISOString()}] Checking ${depositWallets.length} deposit wallets...`);
    for (const depositWallet of depositWallets) {
        const privateKey = decryptPrivateKey(depositWallet.privateKeyEncrypted);
        const gasCost = await walletService.estimateGasCost(privateKey, depositWallet.address, depositWallet.chain as 'Binance' | 'Ethereum' | 'Tron', depositWallet.token || 'USDT');
        const walletNativeBalance = await walletService.getBalance(depositWallet.address, depositWallet.chain as 'Binance' | 'Ethereum' | 'Tron');
        if (walletNativeBalance >= gasCost) {
            await walletService.sweepToken(privateKey, depositWallet.address, depositWallet.chain as 'Binance' | 'Ethereum' | 'Tron', depositWallet.token || 'USDT');
            await DepositWalletModel.updateOne({ address: depositWallet.address, chain: depositWallet.chain, userId: depositWallet.userId }, { $set: { sweeped: true } });
        } else {
            const gasWallet = gasWallets.find((gasWallet) => gasWallet.chain === depositWallet.chain);
            if (gasWallet) {
                const nativeBalance = await walletService.getBalance(gasWallet.address, gasWallet.chain as 'Binance' | 'Ethereum' | 'Tron');
                if (nativeBalance > gasCost) {
                    const gasWalletPrivateKey = decryptPrivateKey(gasWallet.privateKeyEncrypted);
                    await walletService.prefundGas(gasWalletPrivateKey, depositWallet.address, depositWallet.chain as 'Binance' | 'Ethereum' | 'Tron', gasCost);
                }
            }
        }
    }
}

const job = cron.schedule('* * * * *', async () => {
    console.log(`[${new Date().toISOString()}] Running sweep check...`);
    await checkDepositWallet();
});

// Export the job so it can be started/stopped from elsewhere
export default job;