import { NextRequest, NextResponse } from 'next/server';
import { InterestMatrixModel } from '@/models/InterestMatrix';
import { ObjectId } from 'mongodb';

/**
 * GET /api/interest-matrix
 * Get all interest matrix or a specific interest matrix by ID
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    // Get plan by ID
    if (id) {
      const interestMatrix = await InterestMatrixModel.findOne({ _id: new ObjectId(id) });
      if (!interestMatrix) {
        return NextResponse.json(
          { success: false, error: 'Interest Matrix not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, data: interestMatrix });
    }
    
    // Get all plans
    const interestMatrix = await InterestMatrixModel.find({})
      .sort({ startAccountValue: 1 });
      
    return NextResponse.json({ success: true, data: interestMatrix });
  } catch (error) {
    console.error('Error fetching plans:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch plans' },
      { status: 500 }
    );
  }
}