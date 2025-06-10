import { CoinGeckoService } from './CoinGecko';
import { RedisCacheService } from './RedisCache';
import { CryptoPriceModel } from '../models/CryptoPrice';
import { config } from '../config';
import { logger } from '../utils/logger';
import { PriceUpdate } from '../schemas/price.schema';

export class PriceSyncService {
  private coinGecko: CoinGeckoService;
  private redisCache: RedisCacheService;

  constructor() {
    this.coinGecko = new CoinGeckoService();
    this.redisCache = new RedisCacheService();
  }

  /**
   * Sync prices for all configured symbols
   */
  async syncPrices(): Promise<void> {
    try {
      const symbols = config.symbols;
      logger.info(`Starting price sync for symbols: ${symbols.join(', ')}`);

      // Fetch fresh prices from CoinGecko
      const freshPrices = await this.coinGecko.getPrices(symbols);
      
      // Cache all prices in Redis first
      await this.redisCache.setCachedPrices(freshPrices);
      logger.info('Prices cached in Redis successfully');

      // Store in MongoDB and prepare updates for broadcasting
      const priceUpdates: PriceUpdate[] = [];
      
      await Promise.all(
        Object.values(freshPrices).map(async (update) => {
          // Store in MongoDB
          await CryptoPriceModel.create({
            symbol: update.symbol,
            price: update.price,
            timestamp: update.timestamp,
            priceChange: update.priceChange
          });

          priceUpdates.push(update);
        })
      );

      logger.info(`Successfully completed price sync for ${symbols.length} symbols`);
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Price sync failed: ${error.message}`);
      } else {
        logger.error('Price sync failed with unknown error');
      }
      throw error;
    }
  }

  /**
   * Get current price for a symbol
   * First checks Redis cache, then falls back to CoinGecko if not found
   */
  async getCurrentPrice(symbol: string): Promise<PriceUpdate> {
    try {
      // Check cache first
      const cachedPrice = await this.redisCache.getCachedPrice(symbol);
      if (cachedPrice !== null) {
        logger.info(`Retrieved price for ${symbol} from cache`);
        return cachedPrice;
      }

      // If not in cache, fetch from CoinGecko
      logger.info(`Cache miss for ${symbol}, fetching from CoinGecko`);
      const prices = await this.coinGecko.getPrices([symbol]);
      const update = prices[symbol];

      // Always cache first
      await this.redisCache.setCachedPrice(symbol, update);
      logger.info(`Cached new price for ${symbol}`);

      // Store in MongoDB
      await CryptoPriceModel.create({
        symbol: update.symbol,
        price: update.price,
        timestamp: update.timestamp,
        priceChange: update.priceChange
      });
      logger.info(`Stored new price for ${symbol} in MongoDB`);

      return update;
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Failed to get current price for ${symbol}: ${error.message}`);
        throw new Error(`Failed to get current price: ${error.message}`);
      }
      throw new Error('Failed to get current price');
    }
  }
} 