import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { config } from './src/config';
import init_db from './src/init/init_db';
import depositCron from './src/cron-job/deposit';
import withdrawCron from './src/cron-job/withdraw';
import trustFundCron from './src/cron-job/trustFund';
import priceSyncCron from './src/cron-job/priceSync';
import sweepCron from './src/cron-job/sweep';
import releaseInterestRewardCron from './src/cron-job/releaseInterestReward';
import { walletService } from './src/services/Wallet';
import { decryptPrivateKey } from './src/utils/encrypt';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const dev = config.server.nodeEnv !== 'production';

const app = next({ dev, hostname: config.server.hostname, port: parseInt(config.server.port as string) });
const handle = app.getRequestHandler();

console.log(decryptPrivateKey("46526c2b0376edebf2430fa777b4d702:f83d59da8b62700981ce5feb37b5638e6abad28fcc4b40075718cfd0c6c02bfce283da476cef1722836bba1bbe620f6cb7619ca0a33a6d8e851c21e8e3451dd0bfd0ab302eb7e92f1796853497368a2e"))

async function startServer() {
  try {
    const gasAmount = await walletService.getBalance("TJ8yZCn5bgPPraZMtE4PJngRMzH6XybPsB", "Tron");
    console.log(gasAmount);
    const amount = await walletService.getBalance("TRKJ7X3nL8N55iaiMdb5ABnqK1uFS6cwax", "Tron");
    console.log(amount);

    // await walletService.prefundGas("4F668B9820B89063E92EB4891A09305EC70FDBFC1A0A366B8CA369759E1782F5", "TRKJ7X3nL8N55iaiMdb5ABnqK1uFS6cwax", "Tron", 15)

    // Connect to MongoDB
    await mongoose.connect(config.mongodb.url);
    console.log('Connected to MongoDB');

    await init_db();

    // Initialize Next.js
    await app.prepare();

    // Create HTTP server
    const server = createServer(async (req, res) => {
      try {
        const parsedUrl = parse(req.url!, true);
        await handle(req, res, parsedUrl);
      } catch (err) {
        console.error('Error occurred handling', req.url, err);
        res.statusCode = 500;
        res.end('Internal Server Error');
      }
    });

    server.once('error', (err) => {
      console.error(err);
      process.exit(1);
    });

    server.listen(config.server.port, () => {
      console.log(`> Ready on http://${config.server.hostname}:${config.server.port}`);
    });


    depositCron.start();
    priceSyncCron.start();
    withdrawCron.start();
    trustFundCron.start();
    releaseInterestRewardCron.start();
    sweepCron.start();
  } catch (err) {
    console.error(`Failed to start server: ${err instanceof Error ? err.message : 'Unknown error'}`);
    process.exit(1);
  }
}

startServer(); 