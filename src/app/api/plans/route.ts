import { NextRequest, NextResponse } from 'next/server';
import { PlanModel } from '@/models/Plan';
import { ObjectId } from 'mongodb';

/**
 * GET /api/plans
 * Get all plans or a specific plan by ID
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    // Get plan by ID
    if (id) {
      const plan = await PlanModel.findOne({ _id: new ObjectId(id) });
      if (!plan) {
        return NextResponse.json(
          { success: false, error: 'Plan not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, plan });
    }
    
    // Get all plans
    const plans = await PlanModel.find({})
      .sort({ account_value_start_usd: 1 });
      
    return NextResponse.json({ success: true, plans });
  } catch (error) {
    console.error('Error fetching plans:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch plans' },
      { status: 500 }
    );
  }
}