import { NextResponse } from 'next/server';
import { PriceSyncService } from '@/services/PriceSync';
import { AVAILABLE_SYMBOLS } from '@/schemas/price.schema';

const priceService = new PriceSyncService();

export async function GET() {
  try {
    const pricePromises = AVAILABLE_SYMBOLS.map(symbol => 
      priceService.getCurrentPrice(symbol)
    );

    const prices = await Promise.all(pricePromises);
    const priceRecord = Object.fromEntries(
      prices.map((price, index) => [AVAILABLE_SYMBOLS[index], {
        price: price.price,
        timestamp: price.timestamp,
        priceChange: price.priceChange
      }])
    );

    return NextResponse.json(priceRecord);
  } catch (error) {
    console.error('Error fetching prices:', error);
    return NextResponse.json(
      { error: 'Failed to fetch price data' },
      { status: 500 }
    );
  }
} 