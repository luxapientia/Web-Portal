import cron from 'node-cron';
import { Transaction, TransactionModel } from '../models/Transaction';
import { walletService } from '../services/Wallet';
import { User, UserModel } from '../models/User';
import { CryptoPriceModel } from '../models/CryptoPrice';
import { InterestReward, InterestRewardModel } from '@/models/InterestReward';
import { AppConfig, AppConfigModel } from '@/models/AppConfig';

// Function to check transaction status
async function checkPendingTransactions() {
    try {
        // Get all pending transactions
        const pendingTransactions = await TransactionModel.find({
            status: 'pending',
            type: 'deposit'
        }) as Transaction[];

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

                        if (txDetails.token !== transaction.token) {
                            transaction.status = 'failed';
                            transaction.rejectReason = `The token ${txDetails.token} you provided is not the same as the token ${transaction.token} we provided`;
                        }
                        if (txDetails.fromAddress !== transaction.fromAddress && txDetails.toAddress !== transaction.toAddress) {
                            transaction.status = 'failed';
                            transaction.rejectReason = `The wallet address ${transaction.fromAddress} you provided is not the same as the real transaction fromAddress ${txDetails.fromAddress} and the wallet address ${transaction.toAddress} you sent the funds to is not the same as the wallet address we provided`;
                        } else if (txDetails.fromAddress !== transaction.fromAddress) {
                            transaction.status = 'failed';
                            transaction.rejectReason = `The wallet address ${transaction.fromAddress} you provided is not the same as the real transaction fromAddress ${txDetails.fromAddress}`;
                        } else if (txDetails.toAddress !== transaction.toAddress) {
                            transaction.status = 'failed';
                            transaction.rejectReason = `The wallet address ${transaction.toAddress} you sent the funds to is not the same as the wallet address we provided`;
                        }


                        if (transaction.status === 'success') {
                            const cryptoPrice = await CryptoPriceModel.find({ symbol: txDetails.token || 'USDT' }).sort({ timestamp: -1 }).limit(1);
                            transaction.token = txDetails.token || 'USDT';
                            transaction.amount = txDetails.amount || 0;
                            transaction.amountInUSD = transaction.amount * (cryptoPrice[0]?.price || 1);
                            const user = await UserModel.findById(transaction.fromUserId) as User;

                            const depositTransactions = await TransactionModel.find({ fromUserId: user.id, type: 'deposit', status: { $ne: 'success' } }) as Transaction[];
                            const isFirstDeposit = depositTransactions.length === 0;

                            if (user) {
                                const appConfig = await AppConfigModel.findOne({}) as AppConfig;
                                if (isFirstDeposit) {
                                    const firstDepositBonusPercentage = appConfig.firstDepositBonusPercentage;
                                    const firstDepositBonusPeriod = appConfig.firstDepositBonusPeriod;
                                    const interestReward = await InterestRewardModel.create({
                                        userId: user.id,
                                        type: 'firstDeposit',
                                        amount: transaction.amountInUSD * firstDepositBonusPercentage / 100,
                                        startDate: new Date(),
                                        endDate: new Date(new Date().getTime() + firstDepositBonusPeriod * 24 * 60 * 60 * 1000),
                                        released: false
                                    }) as InterestReward;
                                    user.accountValue.totalDeposited += transaction.amountInUSD;
                                    user.accountValue.totalAssetValue += transaction.amountInUSD + interestReward.amount;
                                    user.accountValue.totalUnreleasedInterest += interestReward.amount;
                                } else {
                                    user.accountValue.totalDeposited += transaction.amountInUSD;
                                    user.accountValue.totalAssetValue += transaction.amountInUSD;
                                }
                                await user.save();
                            }
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