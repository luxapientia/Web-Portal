import { NextResponse } from 'next/server';
import { AppConfig, AppConfigModel } from '@/models/AppConfig';

// Get all trust plans
export async function GET() {
    try {
        const appConfig = await AppConfigModel.findOne({}) as AppConfig;
        if (!appConfig) {
            return NextResponse.json({ success: false, error: 'App config not found' }, { status: 404 });
        }
        const transferSettings = {
            transferFee: appConfig.transfer_fee,
            dailyTransferMaxLimit: appConfig.dailyTransferMaxLimit,
            dailyNumOfTransferLimit: appConfig.dailyNumOfTransferLimit,
        };
        return NextResponse.json({ success: true, data: transferSettings });
    } catch (error) {
        console.error('Error fetching trust plans:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch trust plans' },
            { status: 500 }
        );
    }
}

export async function PUT(request: Request) {
    try {
        const data = await request.json();
        const { transferFee, dailyTransferMaxLimit, dailyNumOfTransferLimit } = data;

        const appConfig = await AppConfigModel.findOne({}) as AppConfig;
        if (!appConfig) {
            return NextResponse.json({ success: false, error: 'App config not found' }, { status: 404 });
        }

        console.log(appConfig, '------')

        appConfig.transfer_fee = transferFee;
        appConfig.dailyTransferMaxLimit = dailyTransferMaxLimit;
        appConfig.dailyNumOfTransferLimit = dailyNumOfTransferLimit;
        await appConfig.save();

        return NextResponse.json({ success: true, data: appConfig });
    } catch (error) {
        console.error('Error updating transfer settings:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update transfer settings' },
            { status: 500 }
        );
    }
}