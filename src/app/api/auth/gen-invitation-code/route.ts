import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { UserCollection } from '@/models/User';
import { generateRandomInvitationCode } from '@/utils/generate-code';

export async function POST(req: Request) {
    const db = await getDb();
    let invitationCode = generateRandomInvitationCode();
    let exists = true;
    while (exists) {
        const existingInvitationCode = await db.collection(UserCollection).findOne({
            invitationCode: invitationCode
        });
        if (!existingInvitationCode) {
            exists = false;
        }
    }
    
    return NextResponse.json({ invitationCode });
} 