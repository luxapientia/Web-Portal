import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/config';
import { CentralWalletModel } from '@/models/CentralWallet';
// import { encryptPrivateKey } from '@/utils/encrypt';
// import { walletService } from '@/services/Wallet';

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

        // // Validate address format based on chain
        // const isValidAddress = walletService.isValidAddress(address, chain);
        // if (!isValidAddress) {
        //     return NextResponse.json(
        //         { success: false, error: 'Invalid wallet address format' },
        //         { status: 400 }
        //     );
        // }

        // Generate new wallet credentials for private key
        // const newWallet = await walletService.generateWalletCredentials(chain);

        // Update the wallet address
        const wallet = await CentralWalletModel.findOneAndUpdate(
            { chain },
            {
                address,
                // privateKeyEncrypted: encryptPrivateKey(newWallet.privateKey)
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