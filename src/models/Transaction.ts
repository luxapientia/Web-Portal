import mongoose, { Schema, Document } from 'mongoose';
import { User, UserCollection } from './User';

export const TransactionCollection = 'transactions';

// Transaction types
export type TransactionType =
  'transfer'
  | 'withdraw'
  | 'interest_deposit'
  | 'trust_deposit'
  | 'deposit'
  | 'sweep'

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
  status: 'pending' | 'success' | 'rejected' | 'requested' | 'failed',
  remarks?: string,
  rejectReason?: string,
}

const TransactionSchema: Schema = new Schema({
  transactionId: { type: String, required: false },
  fromAddress: { type: String, required: false },
  toAddress: { type: String, required: false },
  fromUserId: { type: String, required: false, ref: UserCollection },
  toUserId: { type: String, required: false, ref: UserCollection },
  type: { type: String, required: true },
  amount: { type: Number, required: false },
  amountInUSD: { type: Number, required: false },
  token: { 
    type: String, 
    required: false,
  },
  chain: { 
    type: String, 
    required: false,
  },
  startDate: { type: Date, required: true },
  releaseDate: { type: Date, required: false },
  status: { type: String, required: true, default: 'pending' },
  remarks: { type: String, required: false },
  rejectReason: { type: String, required: false },
}, {
  timestamps: true,
  collection: TransactionCollection
});

export interface TransactionWithRef extends Omit<Transaction, 'fromUserId' | 'toUserId'> {
  fromUserId?: User,
  toUserId?: User,
}

export const TransactionModel = mongoose.models[TransactionCollection] || mongoose.model<TransactionWithRef>(TransactionCollection, TransactionSchema);

export type CreateTransactionInput = Omit<Transaction, '_id' | 'createdAt' | 'updatedAt'>;
export type TransactionWithoutId = Omit<Transaction, '_id'>;
