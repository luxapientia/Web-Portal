import { CoinGeckoService } from './CoinGecko';
import { RedisCacheService } from './RedisCache';
import { CryptoPriceModel } from '../models/CryptoPrice';
import { logger } from '../utils/logger';
import { CryptoPrice } from '../schemas/price.schema';
import { config } from '../config';

export class PriceSyncService {
  private coinGecko: CoinGeckoService;
  private redisCache: RedisCacheService;

  constructor() {
    this.coinGecko = new CoinGeckoService();
    this.redisCache = new RedisCacheService();
  }

  /**
   * Sync prices for all configured cryptoIds
   */
  async syncPrices(): Promise<void> {
    try {
      const cryptoNames = config.cryptoMarket.symbols;

      // Fetch fresh prices from CoinGecko
      const freshPrices = await this.coinGecko.getPrices(cryptoNames);

      // Cache all prices in Redis first
      await this.redisCache.setCachedPrices(freshPrices);
      logger.info('Prices cached in Redis successfully');

      // Store in MongoDB and prepare updates for broadcasting
      const cryptoPrices: CryptoPrice[] = [];
      
      await Promise.all(
        Object.values(freshPrices).map(async (update) => {
          // Store in MongoDB
          await CryptoPriceModel.create({
            symbol: update.symbol,
            image: update.image,
            name: update.name,
            price: update.price,
            timestamp: update.timestamp,
            priceChange: update.priceChange
          });

          cryptoPrices.push(update);
        })
      );

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
  async getCurrentPrice(name: string): Promise<CryptoPrice | null> {
    try {
      // Check cache first
      const cachedPrice = await this.redisCache.getCachedPrice(name);
      return cachedPrice;

      // if (cachedPrice !== null) {
      //   logger.info(`Retrieved price for ${name} from cache`);
      //   return cachedPrice;
      // }

      // // If not in cache, fetch from CoinGecko
      // logger.info(`Cache miss for ${name}, fetching from CoinGecko`);
      // const prices = await this.coinGecko.getPrices([name]);

      // const update = prices[name];

      // // Always cache first
      // await this.redisCache.setCachedPrice(name, update);
      // logger.info(`Cached new price for ${name}`);

      // // Store in MongoDB
      // await CryptoPriceModel.create({
      //   symbol: update.symbol,
      //   name: name,
      //   image: update.image,
      //   price: update.price,
      //   timestamp: update.timestamp,
      //   priceChange: update.priceChange
      // });
      // logger.info(`Stored new price for ${name} in MongoDB`);

      // return update;
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Failed to get current price for ${name}: ${error.message}`);
        throw new Error(`Failed to get current price: ${error.message}`);
      }
      throw new Error('Failed to get current price');
    }
  }
} 