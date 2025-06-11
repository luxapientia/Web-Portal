import mongoose, { Schema, Document } from 'mongoose';

export const TrustPlanCollection = 'trust_plan';

export interface TrustPlan extends Document {
  name: string;
  duration: number;
  dailyInterestRate: number;
}

const TrustPlanSchema: Schema = new Schema({
  name: { type: String, required: true },
  duration: { type: Number, required: true },
  dailyInterestRate: { type: Number, required: true }
}, {
  collection: TrustPlanCollection,
  timestamps: true
});

export const TrustPlanModel = mongoose.models[TrustPlanCollection] || mongoose.model<TrustPlan>(TrustPlanCollection, TrustPlanSchema);

export type CreateTrustPlanInput = Pick<TrustPlan, 'name' | 'duration' | 'dailyInterestRate'>;
export type TrustPlanWithoutId = Omit<TrustPlan, '_id'>;
