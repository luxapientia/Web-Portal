import mongoose, { Schema, Document } from 'mongoose';

export const DailyTaskCollection = 'daily_tasks';

export interface DailyTask extends Document {
  date: string;
  vipLevel: string;
  taskIndex: number;
  isCompleted: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

const DailyTaskSchema: Schema = new Schema({
  date: { type: String, required: true },
  vipLevel: { type: String, required: true },
  taskIndex: { type: Number, required: true },
  isCompleted: { type: Boolean, required: true },
  userId: { type: String, required: true, ref: 'users' }
}, {
  collection: DailyTaskCollection,
  timestamps: true
});

export const DailyTaskModel = mongoose.models[DailyTaskCollection] || mongoose.model<DailyTask>(DailyTaskCollection, DailyTaskSchema);

export type CreateDailyTaskInput = Pick<DailyTask, 'date' | 'vipLevel' | 'taskIndex' | 'isCompleted'>;
export type DailyTaskWithoutId = Omit<DailyTask, '_id'>;
