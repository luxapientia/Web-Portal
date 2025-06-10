import { NextRequest, NextResponse } from 'next/server';
import { CoinGeckoService } from '@/services/CoinGecko';
import { z } from 'zod';

// Schema for query parameters validation
const QueryParamsSchema = z.object({
  coinId: z.string().min(1),
  days: z.string()
    .transform((val) => val === 'max' ? 'max' : parseInt(val, 10))
    .pipe(
      z.union([
        z.number().int().positive(),
        z.literal('max')
      ])
    )
    .default('30'),
  interval: z.enum(['daily', 'hourly']).default('daily')
});

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const queryParams = {
      coinId: searchParams.get('coinId'),
      days: searchParams.get('days') || '30',
      interval: searchParams.get('interval') || 'daily'
    };

    // Validate query parameters
    const { coinId, days, interval } = QueryParamsSchema.parse(queryParams);

    // Initialize CoinGecko service
    const coinGeckoService = new CoinGeckoService();

    // Fetch market chart data
    const chartData = await coinGeckoService.getMarketChart(coinId, days, interval);

    return NextResponse.json({
      success: true,
      data: chartData
    });

  } catch (error) {
    console.error('Error fetching market chart:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid parameters',
          details: error.errors
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch market chart data'
      },
      { status: 500 }
    );
  }
}
