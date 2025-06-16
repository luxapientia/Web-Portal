
import { NextResponse } from 'next/server';
import { AppConfig, AppConfigModel } from '@/models/AppConfig';

// Get all promotion settings
export async function GET() {
    try {
        const appConfig = await AppConfigModel.findOne({}) as AppConfig;
        if (!appConfig) {
            return NextResponse.json({ success: false, error: 'App config not found' }, { status: 404 });
        }
        const promotionSettings = {
            firstDepositBonusPercentage: appConfig.firstDepositBonusPercentage,
            firstDepositBonusPeriod: appConfig.firstDepositBonusPeriod,
        };
        return NextResponse.json({ success: true, data: promotionSettings });
    } catch (error) {
        console.error('Error fetching promotion settings:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch promotion settings' },
            { status: 500 }
        );
    }
}

export async function PUT(request: Request) {
    try {
        const data = await request.json();
        const { firstDepositBonusPercentage, firstDepositBonusPeriod } = data;

        const appConfig = await AppConfigModel.findOne({}) as AppConfig;
        if (!appConfig) {
            return NextResponse.json({ success: false, error: 'App config not found' }, { status: 404 });
        }

        appConfig.firstDepositBonusPercentage = firstDepositBonusPercentage;
        appConfig.firstDepositBonusPeriod = firstDepositBonusPeriod;
        await appConfig.save();

        return NextResponse.json({ success: true, data: appConfig });
    } catch (error) {
        console.error('Error updating promotion settings:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update promotion settings' },
            { status: 500 }
        );
    }
}