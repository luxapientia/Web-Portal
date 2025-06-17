import mongoose, { Schema, Document } from 'mongoose';
import { UserCollection } from './User';

export const InterestRewardCollection = 'interest_reward';

export interface InterestReward extends Document {
  _id: string;
  userId: string;
  type: 'dailyTask' | 'firstDeposit' | 'promotion' | 'uplineDeposit' | 'teamCommision';
  amount: number;
  startDate: Date;
  endDate: Date;
  released: boolean;
  reachedLevel?: number;
}

const InterestRewardSchema: Schema = new Schema({
  userId: { type: String, required: true, ref: UserCollection },
  type: { type: String, required: true },
  amount: { type: Number, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  released: { type: Boolean, required: true, default: false },
  reachedLevel: { type: Number, required: false, default: 1 },
}, {
  collection: InterestRewardCollection,
  timestamps: true
});

export const InterestRewardModel = mongoose.models[InterestRewardCollection] || mongoose.model<InterestReward>(InterestRewardCollection, InterestRewardSchema);

export type CreateInterestRewardInput = Pick<InterestReward, 'userId' | 'type' | 'amount' | 'startDate' | 'endDate' | 'released'>;
export type InterestRewardWithoutId = Omit<InterestReward, '_id'>;
