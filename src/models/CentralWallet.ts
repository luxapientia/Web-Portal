import mongoose, { Schema, Document } from 'mongoose';

export const CentralWalletCollection = 'central_wallet';

export interface CentralWallet extends Document {
  address: string;
  chain: string;
  isInUse: boolean;
  startAmount: number;
}

const CentralWalletSchema: Schema = new Schema({
  address: { type: String, required: true },
  chain: { type: String, required: true },
  isInUse: { type: Boolean, default: false },
  startAmount: { type: Number, default: 0 },
}, {
  collection: CentralWalletCollection,
  timestamps: true
});

export const CentralWalletModel = mongoose.models[CentralWalletCollection] || mongoose.model<CentralWallet>(CentralWalletCollection, CentralWalletSchema);

export type CreateCentralWalletInput = Pick<CentralWallet, 'address' | 'chain'>;
export type CentralWalletWithoutId = Omit<CentralWallet, '_id'>;