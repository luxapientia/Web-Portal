import mongoose, { Schema, Document } from 'mongoose';

export const WalletCollection = 'wallet';

export interface Wallet extends Document {
  address: string;
  privateKeyEncrypted: string;
  chain: string;
}

const WalletSchema: Schema = new Schema({
  address: { type: String, required: true },
  privateKeyEncrypted: { type: String, required: true },
  chain: { type: String, required: true },
}, {
  collection: WalletCollection,
  timestamps: true
});

export const WalletModel = mongoose.models[WalletCollection] || mongoose.model<Wallet>(WalletCollection, WalletSchema);

export type CreateWalletInput = Pick<Wallet, 'address' | 'privateKeyEncrypted' | 'chain'>;
export type WalletWithoutId = Omit<Wallet, '_id'>;
export type WalletWithoutKeys = Omit<Wallet, 'privateKeyEncrypted'>;
