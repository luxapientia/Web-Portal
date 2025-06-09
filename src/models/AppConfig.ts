import mongoose, { Schema, Document } from 'mongoose';

export const AppConfigCollection = 'app_config';

export interface AppConfig extends Document {
  registration_max_img_upload_size: number;
  image_upload_types: string[];
}

const AppConfigSchema: Schema = new Schema({
  registration_max_img_upload_size: { type: Number, required: true },
  image_upload_types: { type: [String], required: true }
}, {
  collection: AppConfigCollection
});

export const AppConfigModel = mongoose.models[AppConfigCollection] || mongoose.model<AppConfig>(AppConfigCollection, AppConfigSchema);

export type CreateAppConfigInput = Pick<AppConfig, 'registration_max_img_upload_size' | 'image_upload_types'>;
export type AppConfigWithoutId = Omit<AppConfig, '_id'>;
