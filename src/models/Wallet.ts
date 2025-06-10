import mongoose, { Schema, Document } from 'mongoose';

export const WalletCollection = 'wallet';

export interface Wallet extends Document {
  userId: string;
  address: string;
  privateKeyEncrypted: string;
  chain: string;
  token: string;
}

const WalletSchema: Schema = new Schema({
  userId: { type: String, required: true },
  address: { type: String, required: true },
  privateKeyEncrypted: { type: String, required: true },
  chain: { type: String, required: true },
  token: { type: String, required: true }
}, {
  collection: WalletCollection,
  timestamps: true
});

export const WalletModel = mongoose.models[WalletCollection] || mongoose.model<Wallet>(WalletCollection, WalletSchema);

export type CreateWalletInput = Pick<Wallet, 'userId' | 'address' | 'privateKeyEncrypted' | 'chain' | 'token'>;
export type WalletWithoutId = Omit<Wallet, '_id'>;
