import { ObjectId } from 'mongodb'

export const AppConfigCollection = 'app_config'

export interface AppConfig {
  _id: ObjectId,
  registration_max_img_upload_size: number,
  image_upload_types: string[],
}

export type CreateAppConfigInput = Pick<AppConfig, 'registration_max_img_upload_size' | 'image_upload_types'>

export type AppConfigWithoutId = Omit<AppConfig, '_id'>
