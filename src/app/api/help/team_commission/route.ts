import { NextResponse } from 'next/server';
import { TeamCommisionLevelModel } from '@/models/TeamCommisionLevel';

export async function GET() {
    try {
        const commissionLevels = await TeamCommisionLevelModel.find({})
            .sort({ level: 1 });
            
        return NextResponse.json({ 
            success: true, 
            data: commissionLevels 
        });
    } catch (error) {
        console.error('Error fetching commission levels:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch commission levels' },
            { status: 500 }
        );
    }
}
