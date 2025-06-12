import mongoose, { Schema, Document } from 'mongoose';

export const InvitationSettingCollection = 'invitation_setting';

export interface InvitationSetting extends Document {
  upline_deposit_amount: number
}

const InvitationSettingSchema: Schema = new Schema({
  upline_deposit_amount: { type: Number, required: true },
}, {
  collection: InvitationSettingCollection
});

export const InvitationSettingModel = mongoose.models[InvitationSettingCollection] || mongoose.model<InvitationSetting>(InvitationSettingCollection, InvitationSettingSchema);

export type CreateInvitationSettingInput = Pick<InvitationSetting, 'upline_deposit_amount'>;
export type InvitationSettingWithoutId = Omit<InvitationSetting, '_id'>;
