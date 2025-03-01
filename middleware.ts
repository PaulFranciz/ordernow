import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // Refresh session if expired
  const { data: { session } } = await supabase.auth.getSession();

  // Optional: Check auth state for protected routes
  const protectedRoutes = ['/profile', '/orders', '/checkout'];
  if (protectedRoutes.includes(req.nextUrl.pathname) && !session) {
    const redirectUrl = new URL('/auth/error', req.url);
    redirectUrl.searchParams.set('error', 'unauthorized');
    redirectUrl.searchParams.set('returnTo', req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

// Match all routes except static files and api
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api routes
     * - public files
     */
    '/((?!_next/static|_next/image|favicon.ico|api|.*\\..*).*)',
  ],
} 