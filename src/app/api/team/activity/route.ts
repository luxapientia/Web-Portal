import { NextResponse } from 'next/server';
import { User, UserModel } from '@/models/User';
import { ActivityLogModel, ActivityLogWithRef } from '@/models/ActivityLog';
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

        const totalTeamMembers: User[] = [...level1Team, ...level2Team, ...level3Team];
        const todayTeamMemberLogs = await ActivityLogModel.find({
            userId: { $in: totalTeamMembers.map(member => member._id) },
            timestamp: { $gte: new Date(new Date().setHours(0, 0, 0, 0)), $lt: new Date(new Date().setHours(23, 59, 59, 999)) }
        }).populate('userId') as ActivityLogWithRef[];

        // const result: { member: User, log: ActivityLogWithRef }[] = todayTeamMemberLogs.map((log: ActivityLogWithRef) => {
        //     const member = totalTeamMembers.find((member: User) => member.id === log.userId);
        //     if (!member) {
        //         return null;
        //     }
        //     return {
        //         member: member,
        //         log: log
        //     }
        // }).filter((result): result is { member: User, log: ActivityLogWithRef } => result !== null);

        return NextResponse.json({
            success: true,
            data: {
                teamActivities: todayTeamMemberLogs
            }
        });
    } catch (error) {
        console.error('Team members error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}