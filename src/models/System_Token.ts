import mongoose, { Schema, Document } from 'mongoose';

export const SystemTokenCollection = 'system_token';

export interface SystemToken extends Document {
  token: 'USDT' | 'USDC';
  chain: 'BSC' | 'Ethereum' | 'TRON';
  standard: 'BEP-20' | 'ERC-20' | 'TRC-20';
  note?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SystemTokenSchema: Schema = new Schema({
  token: { 
    type: String, 
    required: true,
    enum: ['USDT', 'USDC']
  },
  chain: { 
    type: String, 
    required: true,
    enum: ['BSC', 'Ethereum', 'TRON']
  },
  standard: { 
    type: String, 
    required: true,
    enum: ['BEP-20', 'ERC-20', 'TRC-20']
  },
  note: { 
    type: String,
    required: false
  }
}, {
  timestamps: true,
  collection: SystemTokenCollection
});

// Create compound index for unique token-chain combinations
SystemTokenSchema.index({ token: 1, chain: 1 }, { unique: true });

export const SystemTokenModel = mongoose.models[SystemTokenCollection] || mongoose.model<SystemToken>(SystemTokenCollection, SystemTokenSchema);

export type CreateSystemTokenInput = Pick<SystemToken, 'token' | 'chain' | 'standard' | 'note'>;
export type SystemTokenWithoutId = Omit<SystemToken, '_id'>;
