import { NextResponse } from 'next/server';
import { AppConfig, AppConfigModel } from '@/models/AppConfig';

// Get domain settings
export async function GET() {
    try {
        const appConfig = await AppConfigModel.findOne({}) as AppConfig;
        if (!appConfig) {
            return NextResponse.json({ success: false, error: 'App config not found' }, { status: 404 });
        }
        const domainSettings = {
            domain: appConfig.domain,
        };
        return NextResponse.json({ success: true, data: domainSettings });
    } catch (error) {
        console.error('Error fetching domain settings:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch domain settings' },
            { status: 500 }
        );
    }
}

export async function PUT(request: Request) {
    try {
        const data = await request.json();
        const { domain } = data;

        // Validate domain format
        const domainRegex = /^(?:(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,})|(?:\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}))$/;
        if (!domainRegex.test(domain)) {
            return NextResponse.json(
                { success: false, error: 'Invalid domain format' },
                { status: 400 }
            );
        }

        const appConfig = await AppConfigModel.findOne({}) as AppConfig;
        if (!appConfig) {
            return NextResponse.json({ success: false, error: 'App config not found' }, { status: 404 });
        }

        appConfig.domain = domain;
        await appConfig.save();

        return NextResponse.json({ success: true, data: appConfig });
    } catch (error) {
        console.error('Error updating domain settings:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update domain settings' },
            { status: 500 }
        );
    }
} 