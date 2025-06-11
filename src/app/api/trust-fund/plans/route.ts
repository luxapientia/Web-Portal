import { NextResponse } from 'next/server';
import { TrustPlanModel, TrustPlan } from '@/models/TrustPlan';

export async function GET() {
  try {
    const trustPlans = await TrustPlanModel.find({})
      .sort({ duration: 1 }) as TrustPlan[];
      
    return NextResponse.json({ success: true, data: trustPlans });
  } catch (error) {
    console.error('Error fetching trust plans:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch trust plans' },
      { status: 500 }
    );
  }
}