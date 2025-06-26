import mongoose, { Schema, Document } from 'mongoose';
import { UserCollection } from './User';
import { User } from './User';

export const ActivityLogCollection = 'activity_log';

export interface ActivityLog extends Document {
    userId: string;  // User who owns this transaction
    type: 'deposit' | 'withdraw' | 'transfer' | 'daily_task' | 'trust_fund';
    amount: number;
    timestamp: Date;
    toUserId?: string;
}

const ActivityLogSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, required: true, ref: UserCollection },
    type: { type: String, required: true, enum: ['deposit', 'withdraw', 'transfer', 'daily_task', 'trust_fund'] },
    amount: { type: Number, required: true },
    timestamp: { type: Date, required: true },
    toUserId: { type: Schema.Types.ObjectId, required: false, ref: UserCollection }
}, {
    collection: ActivityLogCollection
});

export interface ActivityLogWithRef extends Omit<ActivityLog, 'userId' | 'toUserId'> {
    userId?: User,
    toUserId?: User,
}

export const ActivityLogModel = mongoose.models[ActivityLogCollection] || mongoose.model<ActivityLogWithRef>(ActivityLogCollection, ActivityLogSchema);

export type CreateActivityLogInput = Omit<ActivityLog, '_id' | 'createdAt' | 'updatedAt'>;
export type ActivityLogWithoutId = Omit<ActivityLog, '_id'>;
