import { NextResponse } from 'next/server';
import { generateVerificationEmailContent, sendEmail } from '@/lib/mailgun';
import { emailVerificationSchema } from '@/schemas/auth.schema';
import redis from '@/lib/redis';
import { generateVerificationCode } from '@/utils/generate-code';
import { config } from '@/config';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate email
    const validationResult = emailVerificationSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    const { email } = validationResult.data;
    
    // Check if a code was recently sent
    const existingCode = await redis.get(`email_verification:${email}`);
    if (existingCode) {
      const ttl = await redis.ttl(`email_verification:${email}`);
      if (ttl > 0) {
        return NextResponse.json(
          { error: `Please wait ${ttl} seconds before requesting a new code` },
          { status: 429 }
        );
      }
    }
    
    // Generate verification code
    const code = generateVerificationCode();
    
    // Store code in Redis with 30-second expiration
    await redis.set(
      `email_verification:${email}`,
      code,
      'EX',
      config.email.verificationCodeExpiry
    );

    // Generate email content with updated expiration time
    const { text, html } = generateVerificationEmailContent(code, config.email.verificationCodeExpiry);

    // Send email
    const emailResult = await sendEmail({
      to: email,
      subject: 'Email Verification Code',
      text,
      html,
    });

    if (!emailResult.success) {
      // Clean up Redis if email fails
      await redis.del(`email_verification:${email}`);
      return NextResponse.json(
        { error: 'Failed to send verification email' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        message: 'Verification code sent successfully',
        expiresIn: config.email.verificationCodeExpiry
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in email verification:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { email, code } = body;

    // Get the stored code from Redis
    const storedCode = await redis.get(`email_verification:${email}`);
    
    if (!storedCode) {
      return NextResponse.json(
        { error: 'Verification code has expired or not found' },
        { status: 400 }
      );
    }

    // Check if code matches
    if (storedCode !== code) {
      return NextResponse.json(
        { error: 'Invalid verification code' },
        { status: 400 }
      );
    }

    // Delete the verification code from Redis after successful verification
    await redis.del(`email_verification:${email}`);

    // Store email verified status in Redis (keep for 1 hour)
    await redis.set(`email_verified:${email}`, 'true', 'EX', 3600);

    return NextResponse.json(
      { message: 'Email verified successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in code verification:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 