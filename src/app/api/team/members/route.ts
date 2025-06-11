import { NextResponse } from 'next/server';
import { User, UserModel } from '@/models/User';
import { ObjectId } from 'mongodb';
import { authOptions } from '@/config';
import { getServerSession } from 'next-auth';

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

        const level1Team = await UserModel.find({
            invitationCode: user.myInvitationCode
        }) as User[];

        const level2Team = await UserModel.find({
            invitationCode: { $in: level1Team.map(team => team.myInvitationCode) }
        }) as User[];

        const level3Team = await UserModel.find({
            invitationCode: { $in: level2Team.map(team => team.myInvitationCode) }
        }) as User[];

        return NextResponse.json({
            success: true,
            data: [
                {
                    level: 1,
                    members: level1Team,
                },
                {
                    level: 2,
                    members: level2Team,
                },
                {
                    level: 3,
                    members: level3Team,
                }
            ]
        });

    } catch (error) {
        console.error('Team members error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}