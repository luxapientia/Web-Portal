import { getDb } from './db';
import { PlanCollection } from '@/models/Plan';

// Plan data
const plansData = [
  {
    plan_name: "VIP 1",
    account_value_start_usd: 0,
    account_value_end_usd: 99,
    active_members_above: 0,
    level_change_bonus_reward_usd: 5,
    interest_daily_percent: 2.00,
    reward_per_user_deposit_usd: 1.00,
    interest_from_each_direct_active_user_usd: 0.001,
    daily_tasks_count_allowed: 5,
    daily_tasks_reward_usd: 1.00
  },
  {
    plan_name: "VIP 2",
    account_value_start_usd: 100,
    account_value_end_usd: 500,
    active_members_above: 6,
    level_change_bonus_reward_usd: 10,
    interest_daily_percent: 2.50,
    reward_per_user_deposit_usd: 1.50,
    interest_from_each_direct_active_user_usd: 0.002,
    daily_tasks_count_allowed: 6,
    daily_tasks_reward_usd: 1.00
  },
  {
    plan_name: "VIP 3",
    account_value_start_usd: 501,
    account_value_end_usd: 2000,
    active_members_above: 11,
    level_change_bonus_reward_usd: 20,
    interest_daily_percent: 3.00,
    reward_per_user_deposit_usd: 2.00,
    interest_from_each_direct_active_user_usd: 0.003,
    daily_tasks_count_allowed: 7,
    daily_tasks_reward_usd: 1.00
  },
  {
    plan_name: "VIP 4",
    account_value_start_usd: 2001,
    account_value_end_usd: 5000,
    active_members_above: 21,
    level_change_bonus_reward_usd: 40,
    interest_daily_percent: 3.50,
    reward_per_user_deposit_usd: 2.50,
    interest_from_each_direct_active_user_usd: 0.004,
    daily_tasks_count_allowed: 8,
    daily_tasks_reward_usd: 1.00
  },
  {
    plan_name: "VIP 5",
    account_value_start_usd: 5001,
    account_value_end_usd: 10000,
    active_members_above: 31,
    level_change_bonus_reward_usd: 50,
    interest_daily_percent: 4.00,
    reward_per_user_deposit_usd: 3.00,
    interest_from_each_direct_active_user_usd: 0.005,
    daily_tasks_count_allowed: 9,
    daily_tasks_reward_usd: 1.00
  },
  {
    plan_name: "VIP 6",
    account_value_start_usd: 10001,
    account_value_end_usd: 30000,
    active_members_above: 41,
    level_change_bonus_reward_usd: 60,
    interest_daily_percent: 4.50,
    reward_per_user_deposit_usd: 3.50,
    interest_from_each_direct_active_user_usd: 0.006,
    daily_tasks_count_allowed: 10,
    daily_tasks_reward_usd: 1.00
  }
];

/**
 * Initialize plans in the database
 * This function checks if plans exist, and if not, adds the default plans
 */
export async function initializePlans() {
  try {
    const db = await getDb();
    
    // Check if plans already exist
    const existingPlansCount = await db.collection(PlanCollection).countDocuments();
    
    if (existingPlansCount === 0) {
      console.log('Initializing plans collection with default data...');
      
      // Add timestamps to each plan
      const now = new Date();
      const plansWithTimestamps = plansData.map(plan => ({
        ...plan,
        createdAt: now,
        updatedAt: now
      }));
      
      await db.collection(PlanCollection).insertMany(plansWithTimestamps);
      console.log(`${plansData.length} plans initialized successfully.`);
    } else {
      console.log('Plans collection already contains data. Skipping initialization.');
    }
  } catch (error) {
    console.error('Error initializing plans:', error);
  }
}