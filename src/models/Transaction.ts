import mongoose, { Schema, Document } from 'mongoose';

export const TransactionCollection = 'transactions';

// Transaction types
export type TransactionType =
  'transfer'
  | 'withdraw'
  | 'interest_deposit'
  | 'trust_deposit'
  | 'deposit'

export interface Transaction extends Document {
  _id: string,
  transactionId: string,
  fromAddress?: string,
  toAddress?: string,
  fromUserId?: string,
  toUserId?: string,
  type: TransactionType,
  amount?: number,
  amountInUSD?: number,
  token: string,
  chain: string,
  startDate: Date,
  releaseDate?: Date,
  status: 'pending' | 'success' | 'rejected',
  remarks?: string,
  rejectionReason?: string,
}

const TransactionSchema: Schema = new Schema({
  transactionId: { type: String, required: true },
  fromAddress: { type: String, required: false },
  toAddress: { type: String, required: false },
  fromUserId: { type: String, required: false },
  toUserId: { type: String, required: false },
  type: { type: String, required: true },
  amount: { type: Number, required: false },
  amountInUSD: { type: Number, required: false },
  token: { 
    type: String, 
    required: true,
  },
  chain: { 
    type: String, 
    required: true,
  },
  startDate: { type: Date, required: true },
  releaseDate: { type: Date, required: false },
  status: { type: String, required: true, default: 'pending' },
  remarks: { type: String, required: false },
  rejectionReason: { type: String, required: false },
}, {
  timestamps: true,
  collection: TransactionCollection
});

export const TransactionModel = mongoose.models[TransactionCollection] || mongoose.model<Transaction>(TransactionCollection, TransactionSchema);

export type CreateTransactionInput = Omit<Transaction, '_id' | 'createdAt' | 'updatedAt'>;
export type TransactionWithoutId = Omit<Transaction, '_id'>;
