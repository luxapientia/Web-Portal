import mongoose, { Schema, Document } from 'mongoose';
import { UserCollection } from './User';

export const DepositWalletCollection = 'deposit_wallet';

export interface DepositWallet extends Document {
  userId: string;
  address: string;
  privateKeyEncrypted: string;
  chain: string;
  available: boolean;
}

const DepositWalletSchema: Schema = new Schema({
  userId: { type: String, required: true, ref: UserCollection },
  address: { type: String, required: true },
  privateKeyEncrypted: { type: String, required: true },
  chain: { type: String, required: true },
  available: { type: Boolean, default: true },
}, {
  collection: DepositWalletCollection,
  timestamps: true
});

export const DepositWalletModel = mongoose.models[DepositWalletCollection] || mongoose.model<DepositWallet>(DepositWalletCollection, DepositWalletSchema);

export type CreateDepositWalletInput = Pick<DepositWallet, 'userId' | 'address' | 'privateKeyEncrypted' | 'chain'>;
export type DepositWalletWithoutId = Omit<DepositWallet, '_id'>;
export type DepositWalletWithoutKeys = Omit<DepositWallet, 'privateKeyEncrypted'>;
