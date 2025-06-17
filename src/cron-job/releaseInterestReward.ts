import cron from 'node-cron';
import { User, UserModel } from '../models/User';
import { InterestReward, InterestRewardModel } from '../models/InterestReward';

async function checkInterestReward() {
    const firstDepositInterestRewards = await InterestRewardModel.find({
        type: 'firstDeposit',
        released: false,
        endDate: { $lt: new Date() }
    }) as InterestReward[];
    console.log(`[${new Date().toISOString()}] Checking ${firstDepositInterestRewards.length} first deposit interest rewards...`);
    for (const firstDepositInterestReward of firstDepositInterestRewards) {
        const user = await UserModel.findById(firstDepositInterestReward.userId) as User;
        user.accountValue.totalReleasedInterest += firstDepositInterestReward.amount;
        user.accountValue.totalUnreleasedInterest -= firstDepositInterestReward.amount;
        await user.save();
        firstDepositInterestReward.released = true;
        await firstDepositInterestReward.save();
    }
}

const job = cron.schedule('* * * * *', async () => {
    console.log(`[${new Date().toISOString()}] Running first deposit interest reward check...`);
    await checkInterestReward();
});

// Export the job so it can be started/stopped from elsewhere
export default job;