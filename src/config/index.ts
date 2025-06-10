import dotenv from 'dotenv';

dotenv.config();

export const config = {
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379'
  },
  mongodb: {
    url: process.env.MONGODB_URL || 'mongodb://localhost:27017/web_portal'
  },
  coingecko: {
    baseUrl: 'https://api.coingecko.com/api/v3'
  },
  symbols: (process.env.SYMBOLS || 'bitcoin,ethereum,tether,usd-coin,binancecoin,tron,litecoin,solana')
    .split(',')
    .map(s => s.trim()),
  priceSync: {
    intervalMinutes: 1
  },
  auth: {
    secret: process.env.AUTH_SECRET || 'secret',
    expiresIn: process.env.AUTH_EXPIRES_IN || '1h'
  }
}; 