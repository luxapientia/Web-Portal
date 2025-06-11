import mongoose, { Schema, Document, ObjectId } from 'mongoose';
import { TrustPlanCollection } from './TrustPlan';
import { UserCollection } from './User';

export const TrustFundCollection = 'trust_fund';

export interface TrustFund extends Document {
  userId: ObjectId;
  trustPlanId: ObjectId;
  amount: number;
  startDate: Date;
  endDate: Date;
  dailyInterestRate: number;
}

const TrustFundSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, required: true, ref: UserCollection },
  trustPlanId: { type: Schema.Types.ObjectId, required: true, ref: TrustPlanCollection },
  amount: { type: Number, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  dailyInterestRate: { type: Number, required: true }
}, {
  collection: TrustFundCollection,
  timestamps: true
});

export const TrustFundModel = mongoose.models[TrustFundCollection] || mongoose.model<TrustFund>(TrustFundCollection, TrustFundSchema);

export type CreateTrustFundInput = Pick<TrustFund, 'userId' | 'trustPlanId' | 'amount' | 'startDate' | 'endDate' | 'dailyInterestRate'>;
export type TrustFundWithoutId = Omit<TrustFund, '_id'>;
