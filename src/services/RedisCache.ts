import { PriceUpdate } from '../schemas/price.schema';
import redis from '../lib/redis';

export class RedisCacheService {
  private readonly TTL = 120; // 2 minutes cache TTL

  private getPriceKey(symbol: string): string {
    return `prices:${symbol.toLowerCase()}`;
  }

  async getCachedPrice(symbol: string): Promise<PriceUpdate | null> {
    const data = await redis.get(this.getPriceKey(symbol));
    if (!data) return null;
    
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  }

  async setCachedPrice(symbol: string, priceUpdate: PriceUpdate): Promise<void> {
    await redis.setex(
      this.getPriceKey(symbol),
      this.TTL,
      JSON.stringify(priceUpdate)
    );
  }

  async getCachedPrices(symbols: string[]): Promise<Record<string, PriceUpdate | null>> {
    const pipeline = redis.pipeline();
    symbols.forEach(symbol => {
      pipeline.get(this.getPriceKey(symbol));
    });

    const results = await pipeline.exec();
    const prices: Record<string, PriceUpdate | null> = {};

    if (!results) return prices;

    symbols.forEach((symbol, index) => {
      const [error, data] = results[index];
      console.log(error, data);
      if (data) {
        try {
          prices[symbol] = JSON.parse(data.toString());
        } catch {
          prices[symbol] = null;
        }
      } else {
        prices[symbol] = null;
      }
    });

    return prices;
  }

  async setCachedPrices(updates: Record<string, PriceUpdate>): Promise<void> {
    const pipeline = redis.pipeline();
    
    Object.entries(updates).forEach(([symbol, update]) => {
      pipeline.setex(
        this.getPriceKey(symbol),
        this.TTL,
        JSON.stringify(update)
      );
    });

    await pipeline.exec();
  }
} 