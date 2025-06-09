import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import mongoose from 'mongoose';
import { startPriceSyncJob } from './src/jobs/priceSync';
import { config } from './src/config';
import { logger } from './src/utils/logger';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOSTNAME || '0.0.0.0';
const port = parseInt(process.env.PORT || '3000', 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

async function startServer() {
  try {
    console.log(process.env.MONGODB_URI, '---------');
    // Connect to MongoDB
    await mongoose.connect(config.mongodb.url);
    logger.info('Connected to MongoDB');

    // Initialize Next.js
    await app.prepare();

    // Start price sync job
    // startPriceSyncJob();
    logger.info('Price sync service started');

    // Create HTTP server
    createServer(async (req, res) => {
      try {
        const parsedUrl = parse(req.url!, true);
        await handle(req, res, parsedUrl);
      } catch (err) {
        console.error('Error occurred handling', req.url, err);
        res.statusCode = 500;
        res.end('Internal Server Error');
      }
    })
    .once('error', (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, hostname, () => {
      logger.info(`> Ready on http://${hostname}:${port}`);
    });
  } catch (err) {
    logger.error(`Failed to start server: ${err instanceof Error ? err.message : 'Unknown error'}`);
    process.exit(1);
  }
}

startServer(); 