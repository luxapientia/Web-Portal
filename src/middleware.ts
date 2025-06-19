import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Define public routes that don't require authentication
const publicRoutes = [
    '/auth/login',          // Login page
    '/auth/register',       // Register page
    '/api/auth',       // NextAuth API routes
    '/api/auth/verify-email',
    '/api/auth/register',
    '/api/auth/refresh-token',
    '/api/auth/me',
    '/api/auth/forgot-password',
    '/api/auth/verify-reset-code',
    '/api/auth/reset-password',
    '/api/auth/gen-invitation-code',
    '/api/app-config',
    '/help',
    '/api/help/daily-task',
    '/api/help/team_commission',
    '/api/help/viplevel',
];

export async function middleware(req: NextRequest) {
    // Check if the current path is a public route
    const isPublicRoute = publicRoutes.some(route =>
        req.nextUrl.pathname.startsWith(route)
    );

    // Allow access to public routes
    if (isPublicRoute) {
        return NextResponse.next();
    }

    // For all other routes, require authentication
    // console.log(appConfig.nextAuth.secret, '--------------------');
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
        return NextResponse.redirect(new URL('/auth/login', req.url));
    }

    if(token.status !== 'active') {
        return NextResponse.redirect(new URL('/auth/dashboard', req.url));
    }
    
    if (req.nextUrl.pathname.startsWith('/admin')) {
        if (token.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
    }

    if(req.nextUrl.pathname.startsWith('/api/admin')) {
        if (token.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
    }

    if(req.nextUrl.pathname == '/admin') {
        return NextResponse.redirect(new URL('/admin/dashboard', req.url));
    }

    return NextResponse.next();
}

// Match all routes except static files and API routes that don't need auth
export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * 1. /_next (Next.js internals)
         * 2. /images (inside public directory)
         * 3. /favicon.ico (inside public directory)
         * 4. /api/auth/* (NextAuth.js API routes)
         */
        '/api/:path*',
        '/dashboard',
        '/home/:path*',
        '/admin/:path*',
        '/wallet/:path*',
    ],
}; 