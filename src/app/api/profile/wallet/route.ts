import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { User, UserModel } from '@/models/User';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/config';

/**
 * Wallet information API route
 * Handles updating and retrieving user wallet information
 * 
 * Note: Authentication is handled by the middleware
 */
export async function PUT(request: NextRequest) {
  try {
    // Get user data from request headers (set by middleware)
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await UserModel.findOne({ _id: new ObjectId(session.user.id) }) as User;
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Parse request body
    const body = await request.json();

    // Validate wallet info
    if (!body.withdrawalWallet) {
      return NextResponse.json(
        { success: false, error: 'Withdrawal wallet information is required' },
        { status: 400 }
      );
    }

    const newWithdrawWallet = body.withdrawalWallet.map((wallet: { chain: string; address: string }) => ({
      chain: wallet.chain,
      address: wallet.address
    }));

    user.withdrawalWallet = newWithdrawWallet;
    await user.save();

    return NextResponse.json({ success: true, data: { withdrawalWallet: user.withdrawalWallet || [] } });
  } catch (error) {
    console.error('Error updating wallet information:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update wallet information' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await UserModel.findOne({ _id: new ObjectId(session.user.id) }) as User;
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: { withdrawalWallet: user.withdrawalWallet || [] } });
  } catch (error) {
    console.error('Error fetching wallet information:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch wallet information' },
      { status: 500 }
    );
  }
}