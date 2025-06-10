import { NextResponse } from 'next/server';
import { PriceSyncService } from '@/services/PriceSync';
import { PriceUpdate } from '@/schemas/price.schema';
import { config } from '@/config';

const priceService = new PriceSyncService();

export async function GET() {
  try {
    const cryptoNames = config.cryptoMarket.symbols;
    // Get prices for all available symbols
    const pricePromises = cryptoNames.map(name => 
      priceService.getCurrentPrice(name)
    );

    const priceResults = await Promise.all(pricePromises);

    // Convert array of results to a record object
    const prices = priceResults.reduce<Record<string, PriceUpdate>>((acc, price) => {
      if (price) {
        acc[price.symbol] = price;
      }
      return acc;
    }, {});

    return NextResponse.json({
      success: true,
      data: prices
    });
  } catch (error) {
    console.error('Error fetching market sentiment:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch market sentiment'
      },
      { status: 500 }
    );
  }
}
