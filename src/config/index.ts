import dotenv from 'dotenv';

dotenv.config();

export const config = {
  // Server Configuration
  server: {
    hostname: process.env.HOSTNAME || 'localhost',
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
    apiPrefix: '/api'
  },

  // Database Configuration
  mongodb: {
    url: process.env.MONGODB_URL || 'mongodb://localhost:27017/web_portal',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  },

  // Redis Configuration
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    ttl: 3600 // Cache TTL in seconds
  },

  // API Rate Limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  },

  // External API Configuration
  coingecko: {
    baseUrl: 'https://api.coingecko.com/api/v3',
    apiKey: process.env.COINGECKO_API_KEY || '',
    rateLimit: 50 // requests per minute
  },

  // Cryptocurrency Configuration
  crypto: {
    symbols: (process.env.SYMBOLS || 'bitcoin,ethereum,tether,usd-coin,binancecoin,tron,litecoin,solana')
      .split(',')
      .map(s => s.trim()),
    priceSync: {
      intervalMinutes: 1,
      retryAttempts: 3,
      retryDelay: 1000 // ms
    }
  },

  // Email Configuration
  email: {
    from: process.env.EMAIL_FROM || 'noreply@webportal.com',
    smtp: {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || ''
      }
    }
  },

  // Security Configuration
  security: {
    bcryptSaltRounds: 10,
    cors: {
      origin: process.env.CORS_ORIGIN || '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      credentials: true
    },
    csrf: {
      enabled: true,
      cookieName: 'csrf-token'
    }
  },

  // File Upload Configuration
  upload: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif'],
  },

  // Wallet Configuration
  wallet: {
    supportedChains: {
      BSC: {
        type: 'EVM',
        rpcUrl: 'https://bsc-dataseed.binance.org',
        chainId: 56,
        supportedTokens: ['USDT', 'USDC']
      },
      Ethereum: {
        type: 'EVM',
        rpcUrl: 'https://mainnet.infura.io/v3/572fc7760a434384b1f5b69a84081198', // Replace with your Infura Project ID
        chainId: 1,
        supportedTokens: ['USDT', 'USDC']
      },
      TRON: {
        type: 'TRON',
        rpcUrl: 'https://api.trongrid.io',
        tronWeb: {
          fullHost: 'https://api.trongrid.io'
        },
        supportedTokens: ['USDT', 'USDC']
      }
    },
    encryption: {
      algorithm: 'aes-256-cbc',
      secret: process.env.ENCRYPTION_SECRET || '123456789012345678901234567890ab',
      ivLength: 16
    }
  }
}; 