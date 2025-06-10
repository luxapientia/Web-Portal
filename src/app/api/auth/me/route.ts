import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { UserModel } from '@/models/User';
import { authOptions } from '../[...nextauth]/route';

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get user details excluding sensitive information
        const user = await UserModel.findById(session.user.id)
            .select('-password -__v');

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error('Error fetching user details:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
} 