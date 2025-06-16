import { NextResponse } from 'next/server';
import { AppConfig, AppConfigModel } from '@/models/AppConfig';

// Get all withdraw settings
export async function GET() {
    try {
        const appConfig = await AppConfigModel.findOne({}) as AppConfig;
        if (!appConfig) {
            return NextResponse.json({ success: false, error: 'App config not found' }, { status: 404 });
        }
        const transferSettings = {
            withdrawMaxLimit: appConfig.withdrawMaxLimit,
            withdrawPeriod: appConfig.withdrawPeriod,
        };
        return NextResponse.json({ success: true, data: transferSettings });
    } catch (error) {
        console.error('Error fetching withdraw settings:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch withdraw settings' },
            { status: 500 }
        );
    }
}

export async function PUT(request: Request) {
    try {
        const data = await request.json();
        const { withdrawMaxLimit, withdrawPeriod } = data;

        const appConfig = await AppConfigModel.findOne({}) as AppConfig;
        if (!appConfig) {
            return NextResponse.json({ success: false, error: 'App config not found' }, { status: 404 });
        }

        appConfig.withdrawMaxLimit = withdrawMaxLimit;
        appConfig.withdrawPeriod = withdrawPeriod;
        await appConfig.save();

        return NextResponse.json({ success: true, data: appConfig });
    } catch (error) {
        console.error('Error updating withdraw settings:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update withdraw settings' },
            { status: 500 }
        );
    }
}