import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getTokenFromHeader, verifyJWT } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const token = await getTokenFromHeader(request);
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const payload = await verifyJWT(token);
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Return user data
    return NextResponse.json({
      user: {
        id: payload.userId,
        email: payload.email,
        role: payload.role || 'user',
      }
    });
  } catch (error) {
    console.error('Authentication error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 401 }
    );
  }
} 