import { NextResponse } from 'next/server';
import { UserModel } from '@/models/User';
import { authOptions } from '@/config';
import { getServerSession } from 'next-auth';
import { getAccountValue, getVipLevel } from '@/controllers';


export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await UserModel.findById(session.user.id);
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const accountValue = await getAccountValue(user?.id);
        const vipLevel = await getVipLevel(user?.id);

        return NextResponse.json({
            accountValue: accountValue,
            vipLevel: vipLevel,
        });
    } catch {
        return NextResponse.json({ error: 'Failed to get account asset'  }, { status: 500 });
    }
} 


