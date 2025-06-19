import { NextResponse } from 'next/server';
import { InterestMatrixModel } from '@/models/InterestMatrix';

export async function GET() {
  try {
    // Fetch VIP levels and their task data from InterestMatrix
    const vipLevels = await InterestMatrixModel.find({})
      .sort({ level: 1 }) // Sort by level in ascending order
      .select('level dailyTasksCountAllowed dailyTasksRewardPercentage')
      .lean();

    if (!vipLevels || vipLevels.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No VIP level data found'
      }, { status: 404 });
    }

    // Format the data for frontend consumption
    const formattedData = vipLevels.map(level => ({
      level: level.level,
      tasks: level.dailyTasksCountAllowed,
      total: level.dailyTasksRewardPercentage, // Total daily percentage
      perTask: level.dailyTasksRewardPercentage / level.dailyTasksCountAllowed
    }));

    return NextResponse.json({
      success: true,
      data: formattedData
    });

  } catch (error) {
    console.error('Error fetching daily task data:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch daily task data'
    }, { status: 500 });
  }
} 