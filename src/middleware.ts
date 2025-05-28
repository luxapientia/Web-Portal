import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getTokenFromHeader, verifyJWT, signJWT } from '@/lib/auth';

// List of public API routes that don't require authentication
const publicApiRoutes = [
  '/api/auth/verify-email',
  '/api/auth/register',
  '/api/auth/login',
  '/api/auth/logout',
  '/api/auth/refresh-token',
  '/api/auth/me',
  '/api/auth/forgot-password',
  '/api/auth/verify-reset-code',
  '/api/auth/reset-password',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip authentication for public paths
  if (publicApiRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Only apply to /api routes
  if (pathname.startsWith('/api')) {
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

      // Generate new token with extended expiration
      const newToken = await signJWT({
        userId: payload.userId,
        email: payload.email,
        role: payload.role,
      });

      // Add user data as a single JSON object in headers
      const requestHeaders = new Headers(request.headers);
      const userData = {
        id: payload.userId,
        email: payload.email,
        role: payload.role || 'user',
        lastActive: new Date().toISOString(),
      };
      requestHeaders.set('x-user-data', JSON.stringify(userData));

      // Create response with modified headers
      const response = NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });

      // Set the new token in cookie with security flags
      response.headers.set(
        'Set-Cookie',
        `token=${newToken}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${60 * 60 * 24 * 7}`
      );

      return response;
    } catch (error) {
      console.error('Authentication error:', error);
      return NextResponse.json(
        { error: 'Authentication failed' },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

// Configure the paths that middleware will run on
export const config = {
  matcher: [
    // Apply to all API routes
    '/api/:path*',
  ],
}; 