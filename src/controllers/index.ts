import { InterestMatrix, InterestMatrixModel } from '@/models/InterestMatrix';
import { User, UserModel } from '@/models/User';

export const getVipLevel = async (userId: string): Promise<InterestMatrix> => {
    const user = await UserModel.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }
    const accountValue: number = user.accountValue.totalAssetValue;

    const interestMatrix = await InterestMatrixModel.find({}) as InterestMatrix[];

    
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
    const vipLevel = interestMatrix.find(interestMatrix => interestMatrix.startAccountValue <= accountValue && interestMatrix.endAccountValue >= accountValue && interestMatrix.startActiveMembers <= totalActiveMembers && interestMatrix.endActiveMembers >= totalActiveMembers);

    if (!vipLevel) {
        return interestMatrix[0];
    }

    return vipLevel;
}
