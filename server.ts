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

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const dev = config.server.nodeEnv !== 'production';

const app = next({ dev, hostname: config.server.hostname, port: parseInt(config.server.port as string) });
const handle = app.getRequestHandler();



async function startServer() {
  try {
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