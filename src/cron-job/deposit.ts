import cron from 'node-cron';
import { Transaction, TransactionModel } from '../models/Transaction';
import { walletService } from '../services/Wallet';
import { CentralWallet, CentralWalletModel } from '../models/CentralWallet';
import { CryptoPriceModel } from '../models/CryptoPrice';
import { deposit } from '../controllers';

// Function to check transaction status
async function checkPendingTransactions() {
    try {
        // Get all pending transactions
        const pendingTransactions = await TransactionModel.find({
            status: 'pending',
            type: 'deposit',
            transactionId: { $exists: true }
        }) as Transaction[];

        console.log(`[${new Date().toISOString()}] Checking ${pendingTransactions.length} pending transactions...`);

        for (const transaction of pendingTransactions) {
            try {
                // const wallet = await CentralWalletModel.findOne({ address: transaction.toAddress, chain: transaction.chain }) as CentralWallet;
                // if (!wallet) {
                //     console.log(`[${new Date().toISOString()}] Wallet not found for transaction ${transaction.transactionId}`);
                //     continue;
                // }

                // const tokenAmount = await walletService.getBalance(wallet.address, wallet.chain as 'Binance' | 'Ethereum' | 'Tron', transaction.token);

                // if (tokenAmount > wallet.startAmount) {
                //     const cryptoPrice = await CryptoPriceModel.find({ symbol: transaction.token || 'USDT' }).sort({ timestamp: -1 }).limit(1);
                //     transaction.status = 'success';
                //     transaction.releaseDate = new Date();
                //     transaction.amount = tokenAmount - wallet.startAmount;
                //     transaction.amountInUSD = transaction.amount * (cryptoPrice[0]?.price || 1);
                //     await transaction.save();
                //     wallet.isInUse = false;
                //     wallet.startAmount = tokenAmount;
                //     await wallet.save();
                //     await deposit(transaction.fromUserId as string, transaction.amountInUSD);
                // }

                // if (transaction.startDate && transaction.startDate.getTime() + 1000 * 60 * 30 < new Date().getTime()) {
                //     transaction.status = 'failed';
                //     transaction.rejectReason = 'The transaction has not been completed within 30 minutes';
                //     await transaction.save();
                //     wallet.isInUse = false;
                //     await wallet.save();
                // }
                // Check transaction status on blockchain
                const wallet = await CentralWalletModel.findOne({ address: transaction.toAddress, chain: transaction.chain }) as CentralWallet;

                const txDetails = await walletService.getTxDetails(
                    transaction.transactionId,
                    transaction.chain as 'Binance' | 'Ethereum' | 'Tron'
                );


                switch (txDetails.status) {
                    case 'success':
                        // Update transaction status to in_review for admin approval
                        transaction.status = 'success';
                        if (txDetails.amount) {
                            transaction.amount = txDetails.amount;
                        }

                        if (txDetails.toAddress !== transaction.toAddress && txDetails.token !== transaction.token) {
                            transaction.status = 'failed';
                            transaction.rejectReason = `The token ${txDetails.token} you provided is not the same as the token ${transaction.token} we provided and the wallet address ${transaction.toAddress} you sent the funds to is not the same as the wallet address we provided`;
                        } else if (txDetails.token !== transaction.token) {
                            transaction.status = 'failed';
                            transaction.rejectReason = `The token ${txDetails.token} you provided is not the same as the token ${transaction.token} we provided`;
                        } else if (txDetails.toAddress !== transaction.toAddress) {
                            transaction.status = 'failed';
                            transaction.rejectReason = `The wallet address ${transaction.toAddress} you sent the funds to is not the same as the wallet address we provided`;
                        }


                        if (transaction.status === 'success') {
                            const cryptoPrice = await CryptoPriceModel.find({ symbol: txDetails.token || 'USDT' }).sort({ timestamp: -1 }).limit(1);
                            transaction.fromAddress = txDetails.fromAddress;
                            transaction.token = txDetails.token || 'USDT';
                            transaction.amount = txDetails.amount || 0;
                            transaction.amountInUSD = transaction.amount * (cryptoPrice[0]?.price || 1);
                            await deposit(transaction.fromUserId as string, transaction.amountInUSD);
                            transaction.releaseDate = new Date();
                        }

                        await transaction.save();
                        break;

                    case 'failed':
                        // Mark transaction as failed
                        transaction.status = 'failed';
                        transaction.remarks = 'Transaction failed on blockchain';
                        await transaction.save();
                        console.log(`[${new Date().toISOString()}] Transaction ${transaction.transactionId} failed on blockchain.`);
                        break;

                    case 'pending':
                        // Still pending, just log
                        console.log(`[${new Date().toISOString()}] Transaction ${transaction.transactionId} still pending.`);
                        break;
                }
            } catch (error) {
                console.error(`[${new Date().toISOString()}] Error checking transaction ${transaction.transactionId}:`, error);
                // Continue with next transaction even if one fails
                continue;
            }
        }
    } catch (error) {
        console.error(`[${new Date().toISOString()}] Error in checkPendingTransactions:`, error);
    }
}

// Schedule the cron job to run every minute
const job = cron.schedule('* * * * *', async () => {
    console.log(`[${new Date().toISOString()}] Running pending transactions check...`);
    await checkPendingTransactions();
});

// Export the job so it can be started/stopped from elsewhere
export default job;