import { NextRequest, NextResponse } from 'next/server';
import { UserModel } from '@/models/User';
import { authOptions } from '@/config';
import { getServerSession } from 'next-auth';
import { FilterQuery } from 'mongoose';
import { User } from '@/models/User';

export async function GET(request: NextRequest) {
    try {
        // Check authentication and admin role
        const session = await getServerSession(authOptions);
        if (!session?.user?.email || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get query parameters
        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const name = searchParams.get('name');
        const email = searchParams.get('email');
        const phone = searchParams.get('phone');
        const role = searchParams.get('role');
        const status = searchParams.get('status');
        const sortBy = searchParams.get('sortBy');
        const sortOrder = searchParams.get('sortOrder');

        // Build filter query
        const query: FilterQuery<User> = {};

        if (name) {
            query.name = { $regex: name, $options: 'i' };
        }
        if (email) {
            query.email = { $regex: email, $options: 'i' };
        }
        if (phone) {
            query.phone = { $regex: phone, $options: 'i' };
        }
        if (role && role !== 'all') {
            query.role = role;
        }
        if (status && status !== 'all') {
            query.status = status;
        }

        // Build sort query
        const sortQuery: FilterQuery<User> = {};
        if (sortBy && sortOrder) {
            sortQuery[sortBy] = sortOrder === 'asc' ? 1 : -1;
        } else {
            // Default sort by createdAt descending
            sortQuery.createdAt = -1;
        }

        // Calculate skip value for pagination
        const skip = (page - 1) * limit;

        // Execute queries
        const [users, total] = await Promise.all([
            UserModel.find(query)
                .sort(sortQuery)
                .skip(skip)
                .limit(limit)
                .lean(),
            UserModel.countDocuments(query)
        ]);

        return NextResponse.json({
            success: true,
            data: {
                data: users,
                total,
                page,
                limit
            }
        });
    } catch (error) {
        console.error('Fetching users error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function PATCH(request: NextRequest) {
    try {
        // Check authentication and admin role
        const session = await getServerSession(authOptions);
        if (!session?.user?.email || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { userId, action, value } = await request.json();

        if (!userId || !action || !value) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const user = await UserModel.findById(userId);
        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        switch (action) {
            case 'role':
                if (!['admin', 'user'].includes(value)) {
                    return NextResponse.json(
                        { error: 'Invalid role' },
                        { status: 400 }
                    );
                }
                user.role = value;
                break;

            case 'status':
                if (!['active', 'pending', 'suspended'].includes(value)) {
                    return NextResponse.json(
                        { error: 'Invalid status' },
                        { status: 400 }
                    );
                }
                user.status = value;
                break;

            default:
                return NextResponse.json(
                    { error: 'Invalid action' },
                    { status: 400 }
                );
        }

        await user.save();

        return NextResponse.json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('Updating user error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}