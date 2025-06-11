import mongoose, { Schema, Document } from 'mongoose';

export const ActivityLogCollection = 'activity_log';

export interface ActivityLog extends Document {
    userId: mongoose.Types.ObjectId | string;  // User who owns this transaction
    userEmail: string;
    type: 'deposit' | 'withdraw' | 'transfer' | 'earn' | 'team_earn';
    amount: number;
    timestamp: Date;
}

const ActivityLogSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    userEmail: { type: String, required: true },
    type: { type: String, required: true, enum: ['deposit', 'withdraw', 'transfer', 'earn', 'team_earn'] },
    amount: { type: Number, required: true },
    timestamp: { type: Date, required: true }
}, {
    collection: ActivityLogCollection
});

export const ActivityLogModel = mongoose.models[ActivityLogCollection] || mongoose.model<ActivityLog>(ActivityLogCollection, ActivityLogSchema);

export type CreateActivityLogInput = Omit<ActivityLog, '_id' | 'createdAt' | 'updatedAt'>;
export type ActivityLogWithoutId = Omit<ActivityLog, '_id'>;
