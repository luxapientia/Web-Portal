import mongoose, { Schema, Document } from 'mongoose';
import { TrustPlanCollection } from './TrustPlan';
import { UserCollection } from './User';

export const TrustFundCollection = 'trust_fund';

export interface TrustFund extends Document {
  userId: string;
  trustPlanId: string;
  amount: number;
  reward: number;
  startDate: Date;
  endDate: Date;
  released: boolean;
  dailyInterestRate: number;
}

const TrustFundSchema: Schema = new Schema({
  userId: { type: String, required: true, ref: UserCollection },
  trustPlanId: { type: String, required: true, ref: TrustPlanCollection },
  amount: { type: Number, required: true },
  reward: { type: Number, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  released: { type: Boolean, required: true, default: false },
  dailyInterestRate: { type: Number, required: true }
}, {
  collection: TrustFundCollection,
  timestamps: true
});

export const TrustFundModel = mongoose.models[TrustFundCollection] || mongoose.model<TrustFund>(TrustFundCollection, TrustFundSchema);

export type CreateTrustFundInput = Pick<TrustFund, 'userId' | 'trustPlanId' | 'amount' | 'startDate' | 'endDate' | 'dailyInterestRate'>;
export type TrustFundWithoutId = Omit<TrustFund, '_id'>;
