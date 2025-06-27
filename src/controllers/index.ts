import { ActivityLog, ActivityLogModel } from '../models/ActivityLog';
import { AppConfig, AppConfigModel } from '../models/AppConfig';
import { InterestMatrix, InterestMatrixModel } from '../models/InterestMatrix';
import { InterestReward, InterestRewardModel } from '../models/InterestReward';
import { TeamCommisionLevel, TeamCommisionLevelModel } from '../models/TeamCommisionLevel';
import { User, UserModel } from '../models/User';

export const getVipLevel = async (userId: string): Promise<InterestMatrix> => {
    const user = await UserModel.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }
    const accountValue: number = user.accountValue.totalAssetValue;

    // const interestMatrix = await InterestMatrixModel.find({}) as InterestMatrix[];


    const level1Team = await UserModel.find({
        invitationCode: user.myInvitationCode,
        status: 'active'
    }) as User[];

    const level2Team = await UserModel.find({
        invitationCode: { $in: level1Team.map(team => team.myInvitationCode) },
        status: 'active'
    }) as User[];

    const level3Team = await UserModel.find({
        invitationCode: { $in: level2Team.map(team => team.myInvitationCode) },
        status: 'active'
    }) as User[];

    const totalActiveMembers = level1Team.length + level2Team.length + level3Team.length;
    // const vipLevel = interestMatrix.find(interestMatrix => interestMatrix.startAccountValue <= accountValue && interestMatrix.startActiveMembers <= totalActiveMembers && interestMatrix.endActiveMembers >= totalActiveMembers);

    const vipLevel = await InterestMatrixModel.find({
        startAccountValue: { $lte: accountValue },
        startActiveMembers: { $lte: totalActiveMembers },
    }).sort({ level: -1 }).limit(1) as InterestMatrix[];

    if (vipLevel.length === 0) {
        const vipLevels = await InterestMatrixModel.find({}).sort({ level: 1 }).limit(1) as InterestMatrix[];
        return vipLevels[0];
    }

    return vipLevel[0];
}

export const deposit = async (userId: string, amount: number) => {
    const user = await UserModel.findById(userId) as User;
    const startVipLevel = await getVipLevel(user.id);

    const isFirstDeposit = user.accountValue.totalDeposited === 0;

    if (user) {
        const appConfig = await AppConfigModel.findOne({}) as AppConfig;
        if (isFirstDeposit) {
            const firstDepositBonusPercentage = appConfig.firstDepositBonusPercentage;
            const firstDepositBonusPeriod = appConfig.firstDepositBonusPeriod;
            const interestReward = await InterestRewardModel.create({
                userId: user.id,
                type: 'firstDeposit',
                amount: amount * firstDepositBonusPercentage / 100,
                startDate: new Date(),
                endDate: new Date(new Date().getTime() + firstDepositBonusPeriod * 24 * 60 * 60 * 1000),
                released: false
            }) as InterestReward;
            user.accountValue.totalDeposited += amount;
            user.accountValue.totalWithdrawable += amount;
            user.accountValue.totalAssetValue += amount + interestReward.amount;
            user.accountValue.totalUnreleasedInterest += interestReward.amount;

            const invitingUser = await UserModel.findOne({ invitationCode: user.invitationCode }) as User;
            const vipLevel: InterestMatrix = await getVipLevel(invitingUser.id);
            const uplineDepositAmount = vipLevel.uplineDepositAmount;
            if (amount >= uplineDepositAmount) {
                const uplineDepositReward = vipLevel.uplineDepositReward;
                invitingUser.accountValue.totalAssetValue += uplineDepositReward;
                await getUplineDepositReward(invitingUser.id, uplineDepositReward);
            }
        } else {
            user.accountValue.totalDeposited += amount;
            user.accountValue.totalWithdrawable += amount;
            user.accountValue.totalAssetValue += amount;
        }
        await user.save();
    }

    await ActivityLogModel.create({
        userId: user.id,
        type: 'deposit',
        amount: amount,
        timestamp: new Date()
    }) as ActivityLog;

    const currentVipLevel = await getVipLevel(user.id);
    if (currentVipLevel.level > startVipLevel.level) {
        await getPromotionReward(user.id);
    }
}


export const getUplineDepositReward = async (userId: string, amount: number) => {
    const user = await UserModel.findById(userId) as User;
    const startVipLevel = await getVipLevel(user.id);
    user.accountValue.totalAssetValue += amount;
    user.accountValue.totalReleasedInterest += amount;
    await InterestRewardModel.create({
        userId: user.id,
        type: 'uplineDeposit',
        amount: amount,
        startDate: new Date(),
        endDate: new Date(),
        released: true
    }) as InterestReward;

    await user.save();

    const currentVipLevel = await getVipLevel(user.id);
    if (currentVipLevel.level > startVipLevel.level) {
        await getPromotionReward(user.id);
    }
}

export const withdraw = async (userId: string, amount: number) => {
    const user = await UserModel.findById(userId) as User;
    if (user) {
        user.accountValue.totalWithdrawable -= amount;
        user.accountValue.totalAssetValue -= amount;
        await user.save();

        await ActivityLogModel.create({
            userId: user.id,
            type: 'withdraw',
            amount: amount,
            timestamp: new Date()
        }) as ActivityLog;
    }
}

export const trustFund = async (userId: string, amount: number) => {
    const user = await UserModel.findById(userId) as User;
    const startVipLevel = await getVipLevel(user.id);
    user.accountValue.totalWithdrawable += amount;
    user.accountValue.totalAssetValue += amount;
    user.accountValue.totalInTrustFund -= amount;
    user.accountValue.totalTrustReleased += amount;
    await user.save();

    await ActivityLogModel.create({
        userId: user.id,
        type: 'trust_fund',
        amount: amount,
        timestamp: new Date()
    }) as ActivityLog;

    const currentVipLevel = await getVipLevel(user.id);
    if (currentVipLevel.level > startVipLevel.level) {
        await getPromotionReward(user.id);
    }
}

export const transfer = async (fromUserId: string, toUserId: string, amount: number, transferFee: number) => {
    const user = await UserModel.findById(fromUserId) as User;
    const startVipLevel = await getVipLevel(user.id);
    // const recipientUser = await UserModel.findById(toUserId) as User;
    user.accountValue.totalAssetValue -= (amount + transferFee);
    user.accountValue.totalWithdrawable -= (amount + transferFee);
    await deposit(toUserId, amount);
    // recipientUser.accountValue.totalAssetValue += amount;
    // recipientUser.accountValue.totalWithdrawable += amount;
    await user.save();
    // await recipientUser.save();

    await ActivityLogModel.create({
        userId: user.id,
        type: 'transfer',
        amount: amount,
        toUserId: toUserId,
        timestamp: new Date()
    }) as ActivityLog;

    const currentVipLevel = await getVipLevel(user.id);
    if (currentVipLevel.level > startVipLevel.level) {
        await getPromotionReward(user.id);
    }
}

export const getDailyTaskReward = async (userId: string, rewardPercentage: number) => {
    const user = await UserModel.findById(userId) as User;
    const startVipLevel = await getVipLevel(user.id);

    if (user.accountValue.totalAssetValue > 100) {
        const level1InvitingUser = await UserModel.findOne({ myInvitationCode: user.invitationCode }) as User;

        if (level1InvitingUser) {
            const teamCommisionLevel1 = await TeamCommisionLevelModel.findOne({ level: 1 }) as TeamCommisionLevel;
            await getTeamCommisionReward(level1InvitingUser.id, user.accountValue.totalWithdrawable * teamCommisionLevel1.percentage / 100 * rewardPercentage / 100);

            const level2InvitingUser = await UserModel.findOne({ myInvitationCode: level1InvitingUser.invitationCode }) as User;
            if (level2InvitingUser) {
                const teamCommisionLevel2 = await TeamCommisionLevelModel.findOne({ level: 2 }) as TeamCommisionLevel;
                await getTeamCommisionReward(level2InvitingUser.id, user.accountValue.totalWithdrawable * teamCommisionLevel2.percentage / 100 * rewardPercentage / 100);

                const level3InvitingUser = await UserModel.findOne({ myInvitationCode: level2InvitingUser.invitationCode }) as User;
                if (level3InvitingUser) {
                    const teamCommisionLevel3 = await TeamCommisionLevelModel.findOne({ level: 3 }) as TeamCommisionLevel;
                    await getTeamCommisionReward(level3InvitingUser.id, user.accountValue.totalWithdrawable * teamCommisionLevel3.percentage / 100 * rewardPercentage / 100);
                }
            }

        }
    }

    const rewardAmount = user.accountValue.totalWithdrawable * rewardPercentage / 100;
    user.accountValue.totalAssetValue += rewardAmount;
    user.accountValue.totalReleasedInterest += rewardAmount;
    await user.save();

    await ActivityLogModel.create({
        userId: user.id,
        type: 'daily_task',
        amount: rewardAmount,
        timestamp: new Date()
    }) as ActivityLog;

    await InterestRewardModel.create({
        userId: user.id,
        type: 'dailyTask',
        amount: rewardAmount,
        startDate: new Date(),
        endDate: new Date(),
        released: true
    }) as InterestReward;

    const currentVipLevel = await getVipLevel(user.id);
    if (currentVipLevel.level > startVipLevel.level) {
        await getPromotionReward(user.id);
    }
}

export const getTeamCommisionReward = async (userId: string, amount: number) => {
    const user = await UserModel.findById(userId) as User;
    const startVipLevel = await getVipLevel(user.id);

    user.accountValue.totalAssetValue += amount;
    user.accountValue.totalReleasedInterest += amount;
    await user.save();

    await InterestRewardModel.create({
        userId: user.id,
        type: 'teamCommision',
        amount: amount,
        startDate: new Date(),
        endDate: new Date(),
        released: true
    }) as InterestReward;

    const currentVipLevel = await getVipLevel(user.id);
    if (currentVipLevel.level > startVipLevel.level) {
        await getPromotionReward(user.id);
    }
}

export const getPromotionReward = async (userId: string) => {
    const user = await UserModel.findById(userId) as User;
    const currentVipLevel = await getVipLevel(user.id);
    const promotionInterestReward = await InterestRewardModel.findOne({ userId: user.id, type: 'promotion', reachedLevel: currentVipLevel.level }) as InterestReward;
    if (!promotionInterestReward) {
        user.accountValue.totalAssetValue += currentVipLevel.promotionReward;
        user.accountValue.totalReleasedInterest += currentVipLevel.promotionReward;
        await user.save();
        await InterestRewardModel.create({
            userId: user.id,
            type: 'promotion',
            amount: currentVipLevel.promotionReward,
            startDate: new Date(),
            endDate: new Date(),
            released: true,
            reachedLevel: currentVipLevel.level
        }) as InterestReward;
    }
}
