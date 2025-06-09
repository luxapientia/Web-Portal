import { NextResponse } from 'next/server';
import { UserModel } from '@/models/User';
import redis from '@/lib/redis';
import bcrypt from 'bcryptjs';
import { resetPasswordSchema } from '@/schemas/password-reset.schema';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Validate request data
    const validatedFields = resetPasswordSchema.safeParse(body);
    
    if (!validatedFields.success) {
      return NextResponse.json(
        { error: 'Invalid input data' },
        { status: 400 }
      );
    }

    const { email, password } = validatedFields.data;

    // Check if user exists
    const user = await UserModel.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { error: 'No account found with this email' },
        { status: 404 }
      );
    }

    // Verify code one last time
    const isVerified = await redis.get(`password_reset_verified:${email}`);
    if (!isVerified) {
      return NextResponse.json(
        { error: 'Invalid or expired verification code' },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Update password
    await UserModel.updateOne(
      { email },
      { $set: { password: hashedPassword } }
    );

    // Delete verification code from Redis
    await redis.del(`password_reset_verified:${email}`);

    return NextResponse.json(
      { message: 'Password reset successful' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json(
      { error: 'Failed to reset password' },
      { status: 500 }
    );
  }
} 