import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/config';
import { CentralWalletModel } from '@/models/CentralWallet';

export async function PUT(request: NextRequest) {
    try {
        // Check authentication and admin status
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const role = session.user.role;
        if (role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const { chain, address } = await request.json();

        // Validate chain
        if (!['Ethereum', 'Binance', 'Tron'].includes(chain)) {
            return NextResponse.json(
                { success: false, error: 'Invalid chain' },
                { status: 400 }
            );
        }

        // Update the wallet address
        const wallet = await CentralWalletModel.findOneAndUpdate(
            { chain },
            {
                address,
            },
            { new: true }
        );

        if (!wallet) {
            return NextResponse.json(
                { success: false, error: 'Wallet not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: {
                chain: wallet.chain,
                address: wallet.address
            }
        });
    } catch (error) {
        console.error('Error updating wallet address:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update wallet address' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        // Check authentication and admin status
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const role = session.user.role;
        if (role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const { chain, address } = await request.json();

        // Validate chain
        if (!['Ethereum', 'Binance', 'Tron'].includes(chain)) {
            return NextResponse.json(
                { success: false, error: 'Invalid chain' },
                { status: 400 }
            );
        }

        if (await CentralWalletModel.findOne({ chain, address })) {
            return NextResponse.json(
                { success: false, error: 'Wallet already exists' },
                { status: 400 }
            );
        }

        // Create new wallet
        const wallet = await CentralWalletModel.create({
            chain,
            address
        });

        return NextResponse.json({
            success: true,
            data: {
                chain: wallet.chain,
                address: wallet.address
            }
        });
    } catch (error) {
        console.error('Error creating wallet address:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create wallet address' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        // Check authentication and admin status
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const role = session.user.role;
        if (role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const { chain } = await request.json();

        // Validate chain
        if (!['Ethereum', 'Binance', 'Tron'].includes(chain)) {
            return NextResponse.json(
                { success: false, error: 'Invalid chain' },
                { status: 400 }
            );
        }

        // Delete the wallet
        const result = await CentralWalletModel.findOneAndDelete({ chain });

        if (!result) {
            return NextResponse.json(
                { success: false, error: 'Wallet not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: {
                chain: result.chain,
                address: result.address
            }
        });
    } catch (error) {
        console.error('Error deleting wallet address:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to delete wallet address' },
            { status: 500 }
        );
    }
} 