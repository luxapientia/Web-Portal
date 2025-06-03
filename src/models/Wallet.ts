import { ObjectId } from 'mongodb'

export const WalletTransactionCollection = 'wallet_transactions'

// Transaction types
export type TransactionType = 
  | 'deposit' 
  | 'withdraw' 
  | 'profitFromTeam' 
  // | 'dailyInterest'
  // | 'referralBonus'
  // | 'taskReward'
  // | 'levelUpBonus'
  // | 'systemAdjustment'

export interface WalletTransaction {
  _id?: ObjectId
  userId: ObjectId | string  // User who owns this transaction
  depositedBy?: ObjectId | string  // User who made the deposit (if applicable)
  type: TransactionType
  details: string  // Additional details about the transaction
  amount: number  // Transaction amount (positive for credits, negative for debits)
  balance?: number  // Balance after transaction
  status: 'pending' | 'completed' | 'failed' | 'cancelled'
  reference?: string  // External reference number if applicable
  createdAt: Date
  updatedAt: Date
}

export type CreateWalletTransactionInput = Omit<WalletTransaction, '_id' | 'createdAt' | 'updatedAt' | 'balance'>

export type WalletTransactionWithoutId = Omit<WalletTransaction, '_id'>
