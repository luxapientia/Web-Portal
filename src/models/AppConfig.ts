import mongoose, { Schema, Document } from 'mongoose';

export const AppConfigCollection = 'app_config';

export interface AppConfig extends Document {
  registration_max_img_upload_size: number;
  image_upload_types: string[];
  transfer_fee: number;
  dailyTransferMaxLimit: number;
  dailyNumOfTransferLimit: number;
  withdrawMaxLimit: number;
  withdrawPeriod: number;
  firstDepositBonusPercentage: number;
  firstDepositBonusPeriod: number;
  domain: string;
}

const AppConfigSchema: Schema = new Schema({
  registration_max_img_upload_size: { type: Number, required: true },
  image_upload_types: { type: [String], required: true },
  transfer_fee: { type: Number, required: true },
  dailyTransferMaxLimit: { type: Number, required: true },
  dailyNumOfTransferLimit: { type: Number, required: true },
  withdrawMaxLimit: { type: Number, required: true },
  withdrawPeriod: { type: Number, required: true },
  firstDepositBonusPercentage: { type: Number, required: true },
  firstDepositBonusPeriod: { type: Number, required: true },
  domain: { type: String, required: true },
}, {
  collection: AppConfigCollection
});

export const AppConfigModel = mongoose.models[AppConfigCollection] || mongoose.model<AppConfig>(AppConfigCollection, AppConfigSchema);

export type CreateAppConfigInput = Pick<AppConfig, 'registration_max_img_upload_size' | 'image_upload_types' | 'transfer_fee'>;
export type AppConfigWithoutId = Omit<AppConfig, '_id'>;
