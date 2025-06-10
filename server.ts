import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import mongoose from 'mongoose';
import { startPriceSyncJob } from './src/jobs/priceSync';
import { config } from './src/config';
import { logger } from './src/utils/logger';
import { SocketService } from './src/services/SocketService';

const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOSTNAME || '0.0.0.0';
const port = parseInt(process.env.PORT || '3000', 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

async function startServer() {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.mongodb.url);
    logger.info('Connected to MongoDB');

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

    // Initialize Socket.IO service
    const socketService = SocketService.getInstance(server);
    logger.info('Socket.IO service initialized');

    // Start price sync job with socket service
    startPriceSyncJob();
    logger.info('Price sync service started');

    server.once('error', (err) => {
      console.error(err);
      process.exit(1);
    });

    server.listen(port, hostname, () => {
      logger.info(`> Ready on http://${hostname}:${port}`);
    });
  } catch (err) {
    logger.error(`Failed to start server: ${err instanceof Error ? err.message : 'Unknown error'}`);
    process.exit(1);
  }
}

startServer(); 