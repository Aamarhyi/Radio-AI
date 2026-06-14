import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  if (!supabaseUrl || !supabaseAnonKey) {
    // During build or initialization, these variables might be missing.
    return response;
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // This will refresh the session token if it is expired
  const { data: { user } } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // 1. API Route Protection
  // All endpoints under /api/* except /api/auth/*, /api/public/*, or webhook-like public endpoints require auth.
  if (pathname.startsWith('/api')) {
    const isPublicApi = 
      pathname.startsWith('/api/auth') || 
      pathname.startsWith('/api/public') ||
      pathname === '/api/weather'; // allow weather requests to be public or handled gracefully

    if (!isPublicApi && !user) {
      return NextResponse.json(
        { error: 'unauthorized', message: 'You must be logged in to access this resource.' },
        { status: 401 }
      ) as NextResponse;
    }
  }

  // 2. Page Route Protection
  // Protect trip-planning dashboards and custom travel profile pages.
  const isProtectedRoute = 
    pathname.startsWith('/trips') || 
    pathname.startsWith('/dashboard') || 
    pathname.startsWith('/profile') || 
    pathname.startsWith('/checkout') ||
    pathname.startsWith('/collaborate');

  if (isProtectedRoute && !user) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images, robots, etc.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
