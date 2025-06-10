import { NextResponse } from 'next/server';
import { PriceSyncService } from '@/services/PriceSync';

const priceService = new PriceSyncService();

export async function GET(
  request: Request,
  { params }: { params: { symbol: string } }
) {
  try {
    const symbol = params.symbol.toUpperCase();
    const priceData = await priceService.getCurrentPrice(symbol);
    
    if (!priceData) {
      return NextResponse.json(
        { error: `No price data available for ${symbol}` },
        { status: 404 }
      );
    }

    return NextResponse.json(priceData);
  } catch (error) {
    console.error(`Error fetching price for ${params.symbol}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch price data' },
      { status: 500 }
    );
  }
} 