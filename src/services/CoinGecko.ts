import axios from 'axios';
import { config } from '../config';
import { PriceUpdate } from '../schemas/price.schema';

interface CoinGeckoMarketResponse {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number | null;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  roi: {
    times: number;
    currency: string;
    percentage: number;
  } | null;
  last_updated: string;
  price_change_percentage_1h_in_currency: number;
  price_change_percentage_24h_in_currency: number;
  price_change_percentage_7d_in_currency: number;
}

export class CoinGeckoService {
  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = config.coingecko.baseUrl;
  }

  /**
   * Fetch current prices and price changes for multiple symbols
   * @param symbols Array of cryptocurrency symbols
   * @returns Promise<Record<string, PriceUpdate>> Prices and price changes in USD
   */
  async getPrices(symbols: string[]): Promise<Record<string, PriceUpdate>> {
    try {
      const response = await axios.get<CoinGeckoMarketResponse[]>(`${this.baseUrl}/coins/markets`, {
        params: {
          vs_currency: 'usd',
          ids: symbols.join(','),
          price_change_percentage: '1h,24h,7d',
          sparkline: false,
          locale: 'en'
        }
      });

      const updates: Record<string, PriceUpdate> = {};

      response.data.forEach((coin) => {
        updates[coin.id] = {
          symbol: coin.symbol.toUpperCase(),
          price: coin.current_price,
          timestamp: new Date(coin.last_updated),
          priceChange: {
            '1h': coin.price_change_percentage_1h_in_currency,
            '24h': coin.price_change_percentage_24h_in_currency,
            '7d': coin.price_change_percentage_7d_in_currency
          }
        };
      });

      return updates;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch prices from CoinGecko: ${error.message}`);
      }
      throw new Error('Failed to fetch prices from CoinGecko');
    }
  }
} 