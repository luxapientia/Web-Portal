import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/config";
import { UserModel } from "@/models/User";
import { TransactionModel } from "@/models/Transaction";
import { InterestRewardModel } from "@/models/InterestReward";
import { startOfDay } from "date-fns";

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ success: false, data: { error: 'Unauthorized' } }, { status: 401 });
        }

        // Get today's start timestamp
        const todayStart = startOfDay(new Date());

        // User Statistics
        const totalUsers = await UserModel.countDocuments();
        const todayUsers = await UserModel.countDocuments({
            createdAt: { $gte: todayStart }
        });

        // Deposit Statistics
        const depositStats = await TransactionModel.aggregate([
            {
                $match: {
                    type: 'deposit',
                    status: 'success'
                }
            },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: '$amountInUSD' },
                    todayAmount: {
                        $sum: {
                            $cond: [
                                { $gte: ['$startDate', todayStart] },
                                '$amountInUSD',
                                0
                            ]
                        }
                    }
                }
            }
        ]);

        // Interest Statistics from InterestReward
        const interestStats = await InterestRewardModel.aggregate([
            {
                $match: {
                    released: true
                }
            },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: '$amount' },
                    todayAmount: {
                        $sum: {
                            $cond: [
                                { $gte: ['$startDate', todayStart] },
                                '$amount',
                                0
                            ]
                        }
                    }
                }
            }
        ]);

        // Withdrawal Statistics
        const withdrawalStats = await TransactionModel.aggregate([
            {
                $match: {
                    type: 'withdraw',
                    status: 'success'
                }
            },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: '$amountInUSD' },
                    todayAmount: {
                        $sum: {
                            $cond: [
                                { $gte: ['$startDate', todayStart] },
                                '$amountInUSD',
                                0
                            ]
                        }
                    }
                }
            }
        ]);

        // Calculate interest by type
        const interestByType = await InterestRewardModel.aggregate([
            {
                $match: {
                    released: true
                }
            },
            {
                $group: {
                    _id: '$type',
                    totalAmount: { $sum: '$amount' }
                }
            }
        ]);

        return NextResponse.json({
            success: true,
            data: {
                users: {
                    total: totalUsers,
                    today: todayUsers
                },
                deposits: {
                    total: depositStats[0]?.totalAmount || 0,
                    today: depositStats[0]?.todayAmount || 0
                },
                interest: {
                    total: interestStats[0]?.totalAmount || 0,
                    today: interestStats[0]?.todayAmount || 0,
                    byType: Object.fromEntries(
                        interestByType.map(item => [item._id, item.totalAmount])
                    )
                },
                withdrawals: {
                    total: withdrawalStats[0]?.totalAmount || 0,
                    today: withdrawalStats[0]?.todayAmount || 0
                }
            }
        });

    } catch (error) {
        console.error('Error fetching statistics:', error);
        return NextResponse.json(
            { success: false, data: { error: 'Failed to fetch statistics' } },
            { status: 500 }
        );
    }
}
