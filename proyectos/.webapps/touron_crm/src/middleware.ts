import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const session = request.cookies.get('session');
    const { pathname } = request.nextUrl;

    // Public routes that anyone can access
    const publicRoutes = ['/products', '/login', '/api', '/uploads', '/images'];
    const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith('/products/') || pathname.startsWith('/uploads/') || pathname.startsWith('/images/'));

    // If no session and trying to access a restricted route, redirect to login
    if (!session && !isPublicRoute) {
        return NextResponse.redirect(new URL('/products', request.url));
    }

    // If logged in and trying to access login, redirect to dashboard
    if (session && pathname === '/login') {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
