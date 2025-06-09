import { NextResponse } from 'next/server';
import { UserModel } from '@/models/User';
import { generateRandomInvitationCode } from '@/utils/generate-code';

export async function POST() {
    const invitationCode = generateRandomInvitationCode();
    let exists = true;
    while (exists) {
        const existingInvitationCode = await UserModel.findOne({
            invitationCode: invitationCode
        });
        if (!existingInvitationCode) {
            exists = false;
        }
    }
    
    return NextResponse.json({ invitationCode });
} 