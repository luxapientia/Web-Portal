import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { UserModel } from '@/models/User';
import { walletInfoSchema } from '@/schemas/auth.schema';

/**
 * Wallet information API route
 * Handles updating and retrieving user wallet information
 * 
 * Note: Authentication is handled by the middleware
 */
export async function PUT(request: NextRequest) {
  try {
    // Get user data from request headers (set by middleware)
    const userHeader = request.headers.get('user');
    if (!userHeader) {
      return NextResponse.json({ error: 'User data not found' }, { status: 401 });
    }

    const userData = JSON.parse(userHeader);
    const userId = userData.id;
    
    // Parse request body
    const body = await request.json();
    
    // Validate wallet info
    if (!body.withdrawalWallet) {
      return NextResponse.json(
        { success: false, error: 'Withdrawal wallet information is required' },
        { status: 400 }
      );
    }

    try {
      // Validate wallet info using zod schema
      walletInfoSchema.parse(body.withdrawalWallet);
    } catch (error) {
      console.log(error)
      return NextResponse.json(
        { success: false, error: 'Invalid wallet information format' },
        { status: 400 }
      );
    }

    // Update user's wallet info
    const result = await UserModel.updateOne(
      { _id: new ObjectId(userId) },
      { 
        $set: { 
          withdrawalWallet: body.withdrawalWallet,
          updatedAt: new Date()
        } 
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Get updated user data
    const updatedUser = await UserModel.findOne(
      { _id: new ObjectId(userId) },
      { projection: { password: 0 } }
    );

    return NextResponse.json({
      success: true,
      message: 'Wallet information updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Error updating wallet information:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update wallet information' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get user data from request headers (set by middleware)
    const userHeader = request.headers.get('user');
    if (!userHeader) {
      return NextResponse.json({ error: 'User data not found' }, { status: 401 });
    }

    const userData = JSON.parse(userHeader);
    const userId = userData.id;
    
    // Get user data
    const user = await UserModel.findOne(
      { _id: new ObjectId(userId) },
      { projection: { withdrawalWallet: 1 } }
    );

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      withdrawalWallet: user.withdrawalWallet || null
    });
  } catch (error) {
    console.error('Error fetching wallet information:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch wallet information' },
      { status: 500 }
    );
  }
}