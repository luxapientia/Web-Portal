import cron from 'node-cron';
import { priceSyncService } from '../services/PriceSync';
import { config } from '../config';

const job = cron.schedule(`*/${config.cryptoMarket.priceSyncInterval} * * * *`, async () => {
    console.log(`[${new Date().toISOString()}] Running price sync...`);
    await priceSyncService.syncPrices();
});

// Export the job so it can be started/stopped from elsewhere
export default job;