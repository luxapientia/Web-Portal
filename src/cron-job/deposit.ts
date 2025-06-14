import cron from 'node-cron';
import { TransactionModel } from '../models/Transaction';
import { walletService } from '../services/Wallet';

// Function to check transaction status
async function checkPendingTransactions() {
    try {
        // Get all pending transactions
        const pendingTransactions = await TransactionModel.find({
            status: 'pending',
            type: 'deposit'
        });

        console.log(`[${new Date().toISOString()}] Checking ${pendingTransactions.length} pending transactions...`);

        for (const transaction of pendingTransactions) {
            try {
                // Check transaction status on blockchain
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

                        if (txDetails.fromAddress !== transaction.fromAddress && txDetails.toAddress !== transaction.toAddress) {
                            transaction.status = 'rejected';
                            transaction.rejectReason = `The wallet address ${transaction.fromAddress} you provided is not the same as the real transaction fromAddress ${txDetails.fromAddress} and the wallet address ${transaction.toAddress} you sent the funds to is not the same as the wallet address we provided`;
                        } else if (txDetails.fromAddress !== transaction.fromAddress) {
                            transaction.status = 'rejected';
                            transaction.rejectReason = `The wallet address ${transaction.fromAddress} you provided is not the same as the real transaction fromAddress ${txDetails.fromAddress}`;
                        } else if (txDetails.toAddress !== transaction.toAddress) {
                            transaction.status = 'rejected';
                            transaction.rejectReason = `The wallet address ${transaction.toAddress} you sent the funds to is not the same as the wallet address we provided`;
                        }

                        transaction.releaseDate = new Date();
                        await transaction.save();
                        break;

                    case 'failed':
                        // Mark transaction as failed
                        transaction.status = 'rejected';
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