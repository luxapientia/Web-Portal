import { NextRequest, NextResponse } from 'next/server';
import { UserModel } from '@/models/User';
import { authOptions } from '@/config';
import { getServerSession } from 'next-auth';

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { role, userId } = await request.json();

        const user = await UserModel.findByIdAndUpdate(userId, { role }, { new: true });

        return NextResponse.json({ success: true, data: user, message: 'User role updated successfully' });
    } catch (error) {
        console.error('Updating user role error:', error);
        return NextResponse.json({ error: 'Failed to update user role' }, { status: 500 });
    }
}
