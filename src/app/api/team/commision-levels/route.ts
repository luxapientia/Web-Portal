import { NextResponse } from 'next/server';
import { TeamCommisionLevel, TeamCommisionLevelModel } from '@/models/TeamCommisionLevel';

export async function GET() {
    try {
        const teamCommisionLevels = await TeamCommisionLevelModel.find({}).sort({ level: 1 }) as TeamCommisionLevel[];
        return NextResponse.json({
            success: true,
            data: teamCommisionLevels
        });
    } catch (error) {
        console.error('Error getting team commision levels:', error);
        return NextResponse.json({ error: 'Failed to get team commision levels'  }, { status: 500 });
    }
} 