import { NextResponse } from 'next/server';
import { AppConfig, AppConfigModel } from '@/models/AppConfig';

export async function GET() {
    try {
        const appConfig = await AppConfigModel.findOne({}) as AppConfig;
        return NextResponse.json({
            registration_max_img_upload_size: appConfig?.registration_max_img_upload_size,
            image_upload_types: appConfig?.image_upload_types,
            domain: appConfig.domain,
        });
    } catch (error) {
        console.error('Error getting app config:', error);
        return NextResponse.json({ error: 'Failed to get app config'  }, { status: 500 });
    }
} 