import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { AppConfigCollection } from '@/models/AppConfig';

export async function GET(req: Request) {
    try {
        const db = await getDb();
        const appConfig = await db.collection(AppConfigCollection).findOne({});
        return NextResponse.json({
            registration_max_img_upload_size: appConfig?.registration_max_img_upload_size,
            image_upload_types: appConfig?.image_upload_types,
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to get app config' }, { status: 500 });
    }
} 