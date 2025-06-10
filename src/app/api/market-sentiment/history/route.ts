import { NextResponse } from "next/server";
import { CryptoPrice, CryptoPriceModel } from "@/models/CryptoPrice";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);

        const startDate = new Date(searchParams.get('startTime') || Date.now() - 3600 * 1000 * 24);
        const endDate = new Date(searchParams.get('endTime') || Date.now());
        const symbol = searchParams.get('symbol');

        const cryptoPrices = await CryptoPriceModel.find({
            symbol,
            timestamp: { $gte: startDate, $lte: endDate }
        }).sort({ timestamp: 1 }) as CryptoPrice[];

        return NextResponse.json({
            success: true,
            data: cryptoPrices
        });
    } catch {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}