import cron from 'node-cron';
import { TrustFund, TrustFundModel } from '../models/TrustFund';
import { trustFund as trustFundController } from '../controllers';

async function checkTrustFund() {
    const trustFunds = await TrustFundModel.find({
        released: false,
        endDate: { $lt: new Date() }
    }) as TrustFund[];
    console.log(`[${new Date().toISOString()}] Checking ${trustFunds.length} trust funds...`);
    for (const trustFund of trustFunds) {
        await trustFundController(trustFund.userId as string, trustFund.amount);
        trustFund.released = true;
        await trustFund.save();
    }
}

const job = cron.schedule('* * * * *', async () => {
    console.log(`[${new Date().toISOString()}] Running trust fund check...`);
    await checkTrustFund();
});

// Export the job so it can be started/stopped from elsewhere
export default job;