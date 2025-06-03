import { ObjectId } from 'mongodb'

export const PlanCollection = 'plans'

export interface Plan {
  _id?: ObjectId
  plan_name: string
  account_value_start_usd: number
  account_value_end_usd: number
  active_members_above: number
  level_change_bonus_reward_usd: number
  interest_daily_percent: number
  reward_per_user_deposit_usd: number
  interest_from_each_direct_active_user_usd: number
  daily_tasks_count_allowed: number
  daily_tasks_reward_usd: number
  createdAt?: Date
  updatedAt?: Date
}

export type CreatePlanInput = Omit<Plan, '_id' | 'createdAt' | 'updatedAt'>

export type PlanWithoutId = Omit<Plan, '_id'>