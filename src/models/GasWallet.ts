import mongoose, { Schema, Document } from 'mongoose';

export const GasWalletCollection = 'gas_wallet';

export interface GasWallet extends Document {
  address: string;
  privateKeyEncrypted: string;
  chain: string;
}

const GasWalletSchema: Schema = new Schema({
  address: { type: String, required: true },
  privateKeyEncrypted: { type: String, required: true },
  chain: { type: String, required: true },
}, {
  collection: GasWalletCollection,
  timestamps: true
});

export const GasWalletModel = mongoose.models[GasWalletCollection] || mongoose.model<GasWallet>(GasWalletCollection, GasWalletSchema);

export type CreateGasWalletInput = Pick<GasWallet, 'address' | 'privateKeyEncrypted' | 'chain'>;
export type GasWalletWithoutId = Omit<GasWallet, '_id'>;
export type GasWalletWithoutKeys = Omit<GasWallet, 'privateKeyEncrypted'>;
