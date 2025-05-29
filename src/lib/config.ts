export const DATABASE_CONFIG = {
  uri: process.env.MONGODB_URI,
  name: process.env.MONGODB_DB,
  fileMaxSize: process.env.NEXT_PUBLIC_FILE_MAX_SIZE ? parseInt(process.env.NEXT_PUBLIC_FILE_MAX_SIZE) * 1024 * 1024 : 2 * 1024 * 1024,
  options: {
    maxPoolSize: 10,
    minPoolSize: 5,
  },
} as const;

export const AUTH_CONFIG = {
  jwtSecret: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
  tokenExpiration: '24h',
} as const;

export function validateDBConfig() {
  if (!DATABASE_CONFIG.uri) {
    throw new Error('Please add your MongoDB URI to .env.local');
  }

  if (!DATABASE_CONFIG.name) {
    throw new Error('Please add your MongoDB Database name to .env.local');
  }
}

export function validateAuthConfig() {
  if (!process.env.JWT_SECRET) {
    console.warn('Warning: JWT_SECRET not set in environment variables. Using default secret (not recommended for production)');
  }
} 