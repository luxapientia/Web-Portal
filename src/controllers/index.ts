import { Plan, PlanModel } from '@/models/Plan';
import { UserModel } from '@/models/User';

export const getVipLevel = async (userId: string): Promise<Plan> => {
    const user = await UserModel.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }
    let accountValue: number = await getAccountValue(userId);

    if (!accountValue) {
        accountValue = 0;
    }

    const plans = await PlanModel.find({}) as Plan[];

    const vipLevel = plans.find(plan => plan.account_value_start_usd <= accountValue && plan.account_value_end_usd >= accountValue);

    if (!vipLevel) {
        return plans[0];
    }

    return vipLevel;
}

export const getAccountValue = async (userId: string): Promise<number> => {
    console.log(userId);
    // const user = await UserModel.findById(userId);
    // if (!user) {
    //     throw new Error('User not found');
    // }

    // return user.accountValue;
    return 0;
}