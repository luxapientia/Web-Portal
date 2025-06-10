import cron from 'node-cron';
import { PriceSyncService } from '../services/PriceSync';
import { config } from '../config';
import { logger } from '../utils/logger';

// Run every 5 minutes
const cronSchedule = `*/${config.priceSync.intervalMinutes} * * * *`;

export const startPriceSyncJob = (): void => {
  logger.info('Starting price sync job...');
  
  const priceSyncService = new PriceSyncService();

  // Run immediately on start
  priceSyncService.syncPrices().catch(error => {
    logger.error(`Initial price sync failed: ${error.message}`);
  });

  // Schedule recurring job
  cron.schedule(cronSchedule, async () => {
    try {
      await priceSyncService.syncPrices();
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Scheduled price sync failed: ${error.message}`);
      } else {
        logger.error('Scheduled price sync failed with unknown error');
      }
    }
  });

  logger.info(`Price sync job scheduled to run every ${config.priceSync.intervalMinutes} minutes`);
}; 