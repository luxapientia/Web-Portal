import mongoose, { Schema, Document, ObjectId } from 'mongoose';

export const TeamCommisionLevelCollection = 'teamCommisionLevel';

export interface TeamCommisionLevel extends Document {
  level: number;
  percentage: number;
  description: string;
}

const TeamCommisionLevelSchema: Schema = new Schema({
  level: { type: Number, required: true },
  percentage: { type: Number, required: true },
  description: { type: String, required: true }
}, {
  collection: TeamCommisionLevelCollection,
  timestamps: true
});

export const TeamCommisionLevelModel = mongoose.models[TeamCommisionLevelCollection] || mongoose.model<TeamCommisionLevel>(TeamCommisionLevelCollection, TeamCommisionLevelSchema);

export type CreateTeamCommisionLevelInput = Pick<TeamCommisionLevel, 'level' | 'percentage' | 'description'>;
export type TeamCommisionLevelWithoutId = Omit<TeamCommisionLevel, '_id'>;
export type TeamCommisionLevelWithId = TeamCommisionLevel & { _id: ObjectId };
