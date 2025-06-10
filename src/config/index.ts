import dotenv from 'dotenv';
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { UserModel } from '../models/User';


dotenv.config();

// Extend the built-in session types
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      image?: string;
      role: string;
      myInvitationCode: string;
    }
  }

  interface User {
    id: string;
    email: string;
    name: string;
    image?: string;
    role: string;
    myInvitationCode: string;
  }
}

// Extend JWT type
declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    email: string;
    name: string;
    image?: string;
    role: string;
    myInvitationCode: string;
  }
}

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

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        accessToken: { label: "Access Token", type: "text" }
      },
      async authorize(credentials) {
        try {
          console.log(credentials, 'credentials');
          // If accessToken is provided, verify it and return user
          if (credentials?.accessToken && credentials.email) {
            const user = await UserModel.findOne({ email: credentials.email });
            
            if (!user) {
              throw new Error('User not found');
            }

            return {
              id: user._id.toString(),
              email: user.email,
              name: user.name,
              image: user.image,
              role: user.role,
              myInvitationCode: user.myInvitationCode,
            };
          }

          // Regular email/password authentication
          if (!credentials?.email || !credentials?.password) {
            throw new Error('Please enter an email and password');
          }

          const user = await UserModel.findOne({ email: credentials.email });

          if (!user) {
            throw new Error('No user found');
          }

          const isPasswordMatch = await bcrypt.compare(credentials.password, user.password);

          if (!isPasswordMatch) {
            throw new Error('Invalid password');
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            image: user.image,
            role: user.role,
            myInvitationCode: user.myInvitationCode,
          };
        } catch {
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;
        token.role = user.role;
        token.myInvitationCode = user.myInvitationCode;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.image = token.image;
        session.user.role = token.role;
        session.user.myInvitationCode = token.myInvitationCode;
      }
      return session;
    }
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/auth/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
}