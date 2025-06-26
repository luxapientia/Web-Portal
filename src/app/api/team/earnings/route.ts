import { NextResponse } from 'next/server';
import { User, UserModel } from '@/models/User';
// import { ActivityLog, ActivityLogModel } from '@/models/ActivityLog';
import { InterestReward, InterestRewardModel } from '@/models/InterestReward';
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

        const interestRewards = await InterestRewardModel.find({
            userId: user.id,
            type: 'teamCommision'
        }) as InterestReward[];

        const teamCommisionEarnings = interestRewards.reduce((acc, reward) => acc + reward.amount, 0);

        const todayTeamCommisionEarnings = interestRewards.filter((reward) => {
            const rewardDate = new Date(reward.startDate);
            const today = new Date();
            return rewardDate.getDate() === today.getDate() && rewardDate.getMonth() === today.getMonth() && rewardDate.getFullYear() === today.getFullYear();
        }).reduce((acc, reward) => acc + reward.amount, 0);

        // const teamEarningLogs = await ActivityLogModel.find({
        //     userId: user.id,
        //     type: 'team_earn'
        // }) as ActivityLog[];

        // const todayTeamEarningLogs = teamEarningLogs.filter((log) => {
        //     const logDate = new Date(log.timestamp);
        //     const today = new Date();
        //     return logDate.getDate() === today.getDate() && logDate.getMonth() === today.getMonth() && logDate.getFullYear() === today.getFullYear();
        // }) as ActivityLog[];

        // const teamEarnings = todayTeamEarningLogs.reduce((acc, log) => acc + log.amount, 0);
        // const todayTeamEarnings = teamEarnings - teamEarningLogs.reduce((acc, log) => acc + log.amount, 0);

        // const level1Team = await UserModel.find({
        //     invitationCode: user.myInvitationCode
        // }) as User[];

        // const level2Team = await UserModel.find({
        //     invitationCode: { $in: level1Team.map(team => team.myInvitationCode) }
        // }) as User[];

        // const level3Team = await UserModel.find({
        //     invitationCode: { $in: level2Team.map(team => team.myInvitationCode) }
        // }) as User[];

        // const level1TeamEarningLogs = teamEarningLogs.filter((log: ActivityLog) => {
        //     return level1Team.some((team: User) => team.id === log.userId);
        // }) as ActivityLog[];

        // const level2TeamEarningLogs = teamEarningLogs.filter((log: ActivityLog) => {
        //     return level2Team.some((team: User) => team.id === log.userId);
        // }) as ActivityLog[];

        // const level3TeamEarningLogs = teamEarningLogs.filter((log: ActivityLog) => {
        //     return level3Team.some((team: User) => team.id === log.userId);
        // }) as ActivityLog[];


        return NextResponse.json({
            success: true,
            data: {
                teamEarnings: teamCommisionEarnings,
                todayTeamEarnings: todayTeamCommisionEarnings,
                // levelTeamEarnings: [
                //     {
                //         level: 1,
                //         earnings: level1TeamEarningLogs.reduce((acc, log) => acc + log.amount, 0),
                //     },
                //     {
                //         level: 2,
                //         earnings: level2TeamEarningLogs.reduce((acc, log) => acc + log.amount, 0),
                //     },
                //     {
                //         level: 3,
                //         earnings: level3TeamEarningLogs.reduce((acc, log) => acc + log.amount, 0),
                //     },
                // ]
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