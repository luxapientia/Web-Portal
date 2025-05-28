import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { UserCollection } from '@/models/User';
import { signJWT } from '@/lib/auth';
import { loginSchema } from '@/schemas/auth.schema';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate request body
    const validationResult = loginSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid login data' },
        { status: 400 }
      );
    }

    const { email, password } = validationResult.data;
    const db = await getDb();

    // Find user by email
    const user = await db.collection(UserCollection).findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Generate JWT token using our utility
    const token = await signJWT({
      userId: user._id.toString(),
      email: user.email,
      role: user.role || 'user',
    });

    // Return success response with token
    return NextResponse.json(
      {
        message: 'Login successful',
        token,
        user: {
          id: user._id.toString(),
          email: user.email,
          fullName: user.fullName,
          role: user.role || 'user',
        },
      },
      {
        status: 200,
        headers: {
          'Set-Cookie': `token=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${60 * 60 * 24 * 7}`, // 7 days
        },
      }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 