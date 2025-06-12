import mongoose, { Schema, Document } from 'mongoose';

export const WalletTransactionCollection = 'wallet_transactions';

// Transaction types
export type TransactionType =
  'transfer'
  | 'withdraw'
  | 'interest_deposit'
  | 'trust_deposit'
  | 'deposit'

export interface WalletTransaction extends Document {
  _id: string,
  transactionId: string,
  fromUserId?: string,
  toUserId?: string,
  type: TransactionType,
  amount: number,
  startDate: Date,
  releaseDate?: Date,
  remarks: string
}

const WalletTransactionSchema: Schema = new Schema({
  transactionId: { type: String, required: true },
  fromUserId: { type: String, required: false },
  toUserId: { type: String, required: false },
  type: { type: String, required: true },
  amount: { type: Number, required: true },
  startDate: { type: Date, required: true },
  releaseDate: { type: Date, required: false },
  remarks: { type: String, required: true }
}, {
  timestamps: true,
  collection: WalletTransactionCollection
});

export const WalletTransactionModel = mongoose.models[WalletTransactionCollection] || mongoose.model<WalletTransaction>(WalletTransactionCollection, WalletTransactionSchema);

export type CreateWalletTransactionInput = Omit<WalletTransaction, '_id' | 'createdAt' | 'updatedAt'>;
export type WalletTransactionWithoutId = Omit<WalletTransaction, '_id'>;
