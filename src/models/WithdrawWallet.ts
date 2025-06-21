import mongoose, { Schema, Document } from 'mongoose';

export const WithdrawWalletCollection = 'withdraw_wallet';

export interface WithdrawWallet extends Document {
  address: string;
  privateKeyEncrypted: string;
  chain: string;
}

const WithdrawWalletSchema: Schema = new Schema({
  address: { type: String, required: true },
  privateKeyEncrypted: { type: String, required: true },
  chain: { type: String, required: true },
}, {
  collection: WithdrawWalletCollection,
  timestamps: true
});

export const WithdrawWalletModel = mongoose.models[WithdrawWalletCollection] || mongoose.model<WithdrawWallet>(WithdrawWalletCollection, WithdrawWalletSchema);

export type CreateWithdrawWalletInput = Pick<WithdrawWallet, 'address' | 'privateKeyEncrypted' | 'chain'>;
export type WithdrawWalletWithoutId = Omit<WithdrawWallet, '_id'>;
export type WithdrawWalletWithoutKeys = Omit<WithdrawWallet, 'privateKeyEncrypted'>;
