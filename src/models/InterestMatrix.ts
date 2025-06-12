import mongoose, { Schema, Document } from 'mongoose';

export const InterestMatrixCollection = 'interest_matrix';

export interface InterestMatrix extends Document {
  _id: string;
  level: number;
  name: string;
  startAccountValue: number;
  endAccountValue: number;
  startActiveMembers: number;
  endActiveMembers: number;
  promotionReward: number;
  uplineDepositAmount: number;
  uplineDepositReward: number;
  dailyTasksCountAllowed: number;
  dailyTasksRewardPercentage: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const InterestMatrixSchema: Schema = new Schema({
  level: { type: Number, required: true },
  name: { type: String, required: true },
  startAccountValue: { type: Number, required: true },
  endAccountValue: { type: Number, required: true },
  startActiveMembers: { type: Number, required: true },
  endActiveMembers: { type: Number, required: true },
  promotionReward: { type: Number, required: true },
  uplineDepositAmount: { type: Number, required: true },
  uplineDepositReward: { type: Number, required: true },
  dailyTasksCountAllowed: { type: Number, required: true },
  dailyTasksRewardPercentage: { type: Number, required: true }
}, {
  timestamps: true,
  collection: InterestMatrixCollection
});

export const InterestMatrixModel = mongoose.models[InterestMatrixCollection] || mongoose.model<InterestMatrix>(InterestMatrixCollection, InterestMatrixSchema);

export type CreateInterestMatrixInput = Omit<InterestMatrix, '_id' | 'createdAt' | 'updatedAt'>;
export type InterestMatrixWithoutId = Omit<InterestMatrix, '_id'>;
