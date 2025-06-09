import mongoose, { Schema, Document } from 'mongoose';

export const CryptoPriceCollection = 'crypto_prices';

export interface CryptoPrice extends Document {
  symbol: string;
  price: number;
  timestamp: Date;
}

const CryptoPriceSchema = new Schema({
  symbol: {
    type: String,
    required: true,
    index: true
  },
  price: {
    type: Number,
    required: true
  },
  timestamp: {
    type: Date,
    required: true,
    index: true
  }
}, {
  timestamps: true,
  collection: CryptoPriceCollection
});

// Create compound index for efficient querying
CryptoPriceSchema.index({ symbol: 1, timestamp: -1 });

// Check if the model exists before compiling it
export const CryptoPriceModel = mongoose.models[CryptoPriceCollection] || mongoose.model<CryptoPrice>(CryptoPriceCollection, CryptoPriceSchema); 