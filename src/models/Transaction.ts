import mongoose, { Schema, Document } from 'mongoose';

export const WalletTransactionCollection = 'wallet_transactions';

// Transaction types
export type TransactionType = 
  | 'deposit' 
  | 'withdraw' 
  | 'profitFromTeam';
  // | 'dailyInterest'
  // | 'referralBonus'
  // | 'taskReward'
  // | 'levelUpBonus'
  // | 'systemAdjustment'

export interface WalletTransaction extends Document {
  userId: mongoose.Types.ObjectId | string;  // User who owns this transaction
  depositedBy?: mongoose.Types.ObjectId | string;  // User who made the deposit (if applicable)
  type: TransactionType;
  details: string;
  amount: number;
  balance?: number;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  reference?: string;
  createdAt: Date;
  updatedAt: Date;
}

const WalletTransactionSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  depositedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  type: { type: String, enum: ['deposit', 'withdraw', 'profitFromTeam'], required: true },
  details: { type: String, required: true },
  amount: { type: Number, required: true },
  balance: { type: Number },
  status: { type: String, enum: ['pending', 'completed', 'failed', 'cancelled'], required: true },
  reference: { type: String }
}, {
  timestamps: true,
  collection: WalletTransactionCollection
});

export const WalletTransactionModel = mongoose.models[WalletTransactionCollection] || mongoose.model<WalletTransaction>(WalletTransactionCollection, WalletTransactionSchema);

export type CreateWalletTransactionInput = Omit<WalletTransaction, '_id' | 'createdAt' | 'updatedAt' | 'balance'>;
export type WalletTransactionWithoutId = Omit<WalletTransaction, '_id'>;
