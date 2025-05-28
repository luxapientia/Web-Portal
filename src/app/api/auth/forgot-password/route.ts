import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { UserCollection } from '@/models/User';
import redis from '@/lib/redis';
import { sendEmail } from '@/lib/mailgun';
import { emailSchema } from '@/schemas/auth.schema';

// Generate a random 6-digit code
function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Validate email
    const validatedFields = emailSchema.safeParse(body.email);
    
    if (!validatedFields.success) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    const email = validatedFields.data;
    const db = await getDb();

    // Check if user exists
    const user = await db.collection(UserCollection).findOne({ email });

    if (!user) {
      return NextResponse.json(
        { error: 'No account found with this email' },
        { status: 404 }
      );
    }

    // Generate verification code
    const verificationCode = generateVerificationCode();
    
    // Store code in Redis with 30 seconds expiry
    const resetKey = `password_reset:${email}`;
    await redis.setex(resetKey, 30, verificationCode); // 30 seconds expiry

    // Send email with verification code
    await sendEmail({
      to: email,
      subject: 'Password Reset Verification Code',
      text: `Your verification code is: ${verificationCode}. This code will expire in 30 seconds.`,
      html: `
        <h1>Password Reset</h1>
        <p>Your verification code is: <strong>${verificationCode}</strong></p>
        <p>This code will expire in 30 seconds.</p>
        <p>Please enter this code immediately to proceed with password reset.</p>
        <p>If you did not request this password reset, please ignore this email.</p>
      `
    });

    return NextResponse.json(
      { message: 'Verification code sent successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Password reset request error:', error);
    return NextResponse.json(
      { error: 'Failed to process password reset request' },
      { status: 500 }
    );
  }
} 