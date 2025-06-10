import { NextResponse } from 'next/server';
import { AppConfigModel } from '@/models/AppConfig';

export async function GET() {
    try {
        const appConfig = await AppConfigModel.findOne({});
        return NextResponse.json({
            registration_max_img_upload_size: appConfig?.registration_max_img_upload_size,
            image_upload_types: appConfig?.image_upload_types,
        });
    } catch (error) {
        console.error('Error getting app config:', error);
        return NextResponse.json({ error: 'Failed to get app config'  }, { status: 500 });
    }
} 