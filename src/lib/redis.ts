import Redis from 'ioredis';
import { config } from '../config';

// Initialize Redis client
const redis = new Redis({
  host: config.redis.host,
  port: parseInt(config.redis.port),
  password: config.redis.password,
  // Reconnect strategy
  retryStrategy(times) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  }
});

redis.on('error', (error) => {
  console.error('Redis connection error:', error);
});

redis.on('connect', () => {
  console.log('Successfully connected to Redis');
});

export default redis; 