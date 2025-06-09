import { NextResponse } from 'next/server';
import { UserModel } from '@/models/User';
import redis from '@/lib/redis';
import { verifyCodeSchema } from '@/schemas/password-reset.schema';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Validate request data
    const validatedFields = verifyCodeSchema.safeParse(body);
    
    if (!validatedFields.success) {
      return NextResponse.json(
        { error: 'Invalid input data' },
        { status: 400 }
      );
    }

    const { email, verificationCode } = validatedFields.data;

    // Check if user exists
    const user = await UserModel.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { error: 'No account found with this email' },
        { status: 404 }
      );
    }

    // Get stored verification code
    const resetKey = `password_reset:${email}`;
    const storedCode = await redis.get(resetKey);
    
    if (!storedCode) {
      return NextResponse.json(
        { error: 'Verification code has expired or does not exist' },
        { status: 400 }
      );
    }
    
    // Verify code
    if (storedCode !== verificationCode) {
      return NextResponse.json(
        { error: 'Invalid verification code' },
        { status: 400 }
      );
    }
    
    await redis.del(resetKey);
    await redis.set(`password_reset_verified:${email}`, 'true', 'EX', 3600);

    return NextResponse.json(
      { message: 'Code verified successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Code verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify code' },
      { status: 500 }
    );
  }
} 