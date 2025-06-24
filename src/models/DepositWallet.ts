import mongoose, { Schema, Document } from 'mongoose';

export const DepositWalletCollection = 'deposit_wallet';

export interface DepositWallet extends Document {
  address: string;
  privateKeyEncrypted: string;
  chain: string;
}

const DepositWalletSchema: Schema = new Schema({
  address: { type: String, required: true },
  privateKeyEncrypted: { type: String, required: true },
  chain: { type: String, required: true },
}, {
  collection: DepositWalletCollection,
  timestamps: true
});

export const DepositWalletModel = mongoose.models[DepositWalletCollection] || mongoose.model<DepositWallet>(DepositWalletCollection, DepositWalletSchema);

export type CreateDepositWalletInput = Pick<DepositWallet, 'address' | 'privateKeyEncrypted' | 'chain'>;
export type DepositWalletWithoutId = Omit<DepositWallet, '_id'>;
export type DepositWalletWithoutKeys = Omit<DepositWallet, 'privateKeyEncrypted'>;
