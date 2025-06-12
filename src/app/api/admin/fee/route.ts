import { NextResponse } from 'next/server';
import { AppConfig, AppConfigModel } from '@/models/AppConfig';

// Get all matrices
export async function GET() {
    try {
        const appConfig = await AppConfigModel.findOne({}) as AppConfig;
        if (!appConfig) {
            return NextResponse.json({ success: false, error: 'App config not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: appConfig.transfer_fee });
    } catch (error) {
        console.error('Error fetching fee:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch fee' },
            { status: 500 }
        );
    }
}

// Update matrix
export async function PUT(request: Request) {
    try {
        console.log('--------------')
        const data = await request.json();
        const appConfig = await AppConfigModel.findOneAndUpdate({}, {
            transfer_fee: data
        }, {
            new: true
        }) as AppConfig;

        return NextResponse.json({ success: true, data: appConfig.transfer_fee });
    } catch (error) {
        console.error('Error updating fee:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update fee' },
            { status: 500 }
        );
    }
}
