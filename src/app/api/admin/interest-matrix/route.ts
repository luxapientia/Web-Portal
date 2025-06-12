import { NextResponse } from 'next/server';
import { InterestMatrixModel } from '@/models/InterestMatrix';

// Get all matrices
export async function GET() {
    try {
        const matrices = await InterestMatrixModel.find({}).sort({ level: 1 });
        return NextResponse.json({ success: true, matrices });
    } catch (error) {
        console.error('Error fetching matrices:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch matrices' },
            { status: 500 }
        );
    }
}

// Create new matrix
export async function POST(request: Request) {
    try {
        const data = await request.json();
        const matrix = await InterestMatrixModel.create(data);
        return NextResponse.json({ success: true, matrix }, { status: 201 });
    } catch (error) {
        console.error('Error creating matrix:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create matrix' },
            { status: 500 }
        );
    }
}

// Update matrix
export async function PUT(request: Request) {
    try {
        const data = await request.json();
        const { _id, ...updateData } = data;

        const matrix = await InterestMatrixModel.findByIdAndUpdate(
            _id,
            updateData,
            { new: true }
        );

        if (!matrix) {
            return NextResponse.json(
                { success: false, error: 'Matrix not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, matrix });
    } catch (error) {
        console.error('Error updating matrix:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update matrix' },
            { status: 500 }
        );
    }
}

// Delete matrix
export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { success: false, error: 'Matrix ID is required' },
                { status: 400 }
            );
        }

        const matrix = await InterestMatrixModel.findByIdAndDelete(id);

        if (!matrix) {
            return NextResponse.json(
                { success: false, error: 'Matrix not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting matrix:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to delete matrix' },
            { status: 500 }
        );
    }
}
