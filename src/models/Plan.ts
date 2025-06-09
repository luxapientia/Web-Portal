import mongoose, { Schema, Document } from 'mongoose';

export const PlanCollection = 'plans';

export interface Plan extends Document {
  plan_name: string;
  account_value_start_usd: number;
  account_value_end_usd: number;
  active_members_above: number;
  level_change_bonus_reward_usd: number;
  interest_daily_percent: number;
  reward_per_user_deposit_usd: number;
  interest_from_each_direct_active_user_usd: number;
  daily_tasks_count_allowed: number;
  daily_tasks_reward_usd: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const PlanSchema: Schema = new Schema({
  plan_name: { type: String, required: true },
  account_value_start_usd: { type: Number, required: true },
  account_value_end_usd: { type: Number, required: true },
  active_members_above: { type: Number, required: true },
  level_change_bonus_reward_usd: { type: Number, required: true },
  interest_daily_percent: { type: Number, required: true },
  reward_per_user_deposit_usd: { type: Number, required: true },
  interest_from_each_direct_active_user_usd: { type: Number, required: true },
  daily_tasks_count_allowed: { type: Number, required: true },
  daily_tasks_reward_usd: { type: Number, required: true }
}, {
  timestamps: true,
  collection: PlanCollection
});

export const PlanModel = mongoose.models[PlanCollection] || mongoose.model<Plan>(PlanCollection, PlanSchema);

export type CreatePlanInput = Omit<Plan, '_id' | 'createdAt' | 'updatedAt'>;
export type PlanWithoutId = Omit<Plan, '_id'>;
