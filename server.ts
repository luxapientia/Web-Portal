import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { PriceSyncService } from './src/services/PriceSync';
import { config } from './src/config';
import init_db from './src/init/init_db';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const dev = config.server.nodeEnv !== 'production';    

const app = next({ dev, hostname: config.server.hostname, port: parseInt(config.server.port as string) });
const handle = app.getRequestHandler();

const priceSyncService = new PriceSyncService();

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

    await priceSyncService.syncPrices();
    setInterval(async () => {
      priceSyncService.syncPrices();
    }, 1000 * 60 * config.cryptoMarket.priceSyncInterval);
  } catch (err) {
    console.error(`Failed to start server: ${err instanceof Error ? err.message : 'Unknown error'}`);
    process.exit(1);
  }
}

startServer(); 