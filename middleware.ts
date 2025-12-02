import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect admin routes
  if (pathname.startsWith('/admin')) {
    // These routes require authentication - but we can't check localStorage in middleware
    // So we'll just allow the page to load and let the client-side check handle it
    // This is a limitation of Next.js middleware with client-side auth
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/product/:path*', '/collections/:path*'],
};
