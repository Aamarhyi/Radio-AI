import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authHeader = request.headers.get('authorization');

  // Protect API routes (except auth/public)
  if (pathname.startsWith('/api')) {
    const isPublicApi = 
      pathname.startsWith('/api/auth') || 
      pathname.startsWith('/api/public') ||
      pathname === '/api/weather';

    if (!isPublicApi && !authHeader) {
      // Allow the request to proceed - API routes will check auth internally
      return NextResponse.next();
    }
  }

  // Protect page routes
  const isProtectedRoute = 
    pathname.startsWith('/trips') || 
    pathname.startsWith('/dashboard') || 
    pathname.startsWith('/settings') ||
    pathname.startsWith('/help');

  if (isProtectedRoute && !authHeader) {
    // Redirect unauthenticated users to login
    const url = request.nextUrl.clone();
    url.pathname = '/auth/login';
    url.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
