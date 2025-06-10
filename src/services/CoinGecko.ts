import axios from 'axios';
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

interface CoinGeckoMarketChartResponse {
  prices: [number, number][]; // [timestamp, price]
  market_caps: [number, number][]; // [timestamp, market_cap]
  total_volumes: [number, number][]; // [timestamp, volume]
}

export interface MarketChartData {
  timestamps: Date[];
  prices: number[];
  marketCaps: number[];
  volumes: number[];
}

export class CoinGeckoService {
  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = 'https://api.coingecko.com/api/v3'
  }

  /**
   * Fetch current prices and price changes for multiple names
   * @param names Array of cryptocurrency names
   * @returns Promise<Record<string, PriceUpdate>> Prices and price changes in USD
   */
  async getPrices(names: string[]): Promise<Record<string, PriceUpdate>> {
    try {
      const response = await axios.get<CoinGeckoMarketResponse[]>(`${this.baseUrl}/coins/markets`, {
        params: {
          vs_currency: 'usd',
          ids: names.join(','),
          price_change_percentage: '1h,24h,7d',
          sparkline: false,
          locale: 'en'
        }
      });

      const updates: Record<string, PriceUpdate> = {};

      response.data.forEach((coin) => {
        updates[coin.id] = {
          symbol: coin.symbol.toUpperCase(),
          name: coin.name,
          image: coin.image,
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

  /**
   * Fetch historical market chart data for a cryptocurrency
   * @param coinId The coin identifier (e.g., 'bitcoin', 'ethereum')
   * @param days Number of days of data to fetch (1, 7, 14, 30, 90, 180, 365, max)
   * @param interval Data interval ('daily' for days > 30, 'hourly' for days <= 30)
   * @returns Promise<MarketChartData> Historical price, market cap, and volume data
   */
  async getMarketChart(
    coinId: string,
    days: number | 'max' = 30,
    interval: 'daily' | 'hourly' = 'daily'
  ): Promise<MarketChartData> {
    try {
      const response = await axios.get<CoinGeckoMarketChartResponse>(
        `${this.baseUrl}/coins/${coinId}/market_chart`,
        {
          params: {
            vs_currency: 'usd',
            days,
            interval: typeof days === 'number' && days <= 30 ? interval : 'daily', // Force daily for longer periods
          }
        }
      );

      // Transform the data into a more usable format
      const { prices, market_caps, total_volumes } = response.data;
      
      return {
        timestamps: prices.map(([timestamp]) => new Date(timestamp)),
        prices: prices.map(([, price]) => price),
        marketCaps: market_caps.map(([, cap]) => cap),
        volumes: total_volumes.map(([, volume]) => volume)
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch market chart from CoinGecko: ${error.message}`);
      }
      throw new Error('Failed to fetch market chart from CoinGecko');
    }
  }
} 