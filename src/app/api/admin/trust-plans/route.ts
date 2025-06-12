import { NextResponse } from 'next/server';
import { TrustPlanModel } from '@/models/TrustPlan';

// Get all trust plans
export async function GET() {
    try {
        const plans = await TrustPlanModel.find({}).sort({ duration: 1 });
        return NextResponse.json({ success: true, data: plans });
    } catch (error) {
        console.error('Error fetching trust plans:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch trust plans' },
            { status: 500 }
        );
    }
}

// Create new trust plan
export async function POST(request: Request) {
    try {
        const data = await request.json();
        const plan = await TrustPlanModel.create(data);
        return NextResponse.json({ success: true, plan }, { status: 201 });
    } catch (error) {
        console.error('Error creating trust plan:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create trust plan' },
            { status: 500 }
        );
    }
}

// Update trust plan
export async function PUT(request: Request) {
    try {
        const data = await request.json();
        const { _id, ...updateData } = data;

        const plan = await TrustPlanModel.findByIdAndUpdate(
            _id,
            updateData,
            { new: true }
        );

        if (!plan) {
            return NextResponse.json(
                { success: false, error: 'Trust plan not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, plan });
    } catch (error) {
        console.error('Error updating trust plan:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update trust plan' },
            { status: 500 }
        );
    }
}

// Delete trust plan
export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { success: false, error: 'Trust plan ID is required' },
                { status: 400 }
            );
        }

        const plan = await TrustPlanModel.findByIdAndDelete(id);

        if (!plan) {
            return NextResponse.json(
                { success: false, error: 'Trust plan not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting trust plan:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to delete trust plan' },
            { status: 500 }
        );
    }
}
