import { MongoClient, Db } from 'mongodb';
import { DATABASE_CONFIG, validateDBConfig } from './config';

validateDBConfig();

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase() {
  // If we have cached values, use them
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  try {
    // Connect to cluster
    const client = await MongoClient.connect(DATABASE_CONFIG.uri!, DATABASE_CONFIG.options);
    const db = client.db(DATABASE_CONFIG.name);

    // Set cache
    cachedClient = client;
    cachedDb = db;

    return { client, db };
  } catch (error) {
    console.error('Error connecting to database:', error);
    throw new Error('Failed to connect to database.');
  }
}

// Verify database connection
export const verifyConnection = async () => {
  try {
    const { db } = await connectToDatabase();
    await db.command({ ping: 1 });
    console.log('Successfully connected to MongoDB.');
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
};

// Get database instance
export async function getDb() {
  const { db } = await connectToDatabase();
  return db;
}

// Close database connection
export async function closeConnection() {
  if (cachedClient) {
    await cachedClient.close();
    cachedClient = null;
    cachedDb = null;
  }
} 