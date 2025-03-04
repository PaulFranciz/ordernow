import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  // Skip auth check for auth-related routes
  if (req.nextUrl.pathname.startsWith('/auth/')) {
    return NextResponse.next();
  }
  
  // Only check auth for protected routes
  const protectedRoutes = ['/profile', '/orders', '/checkout'];
  const isProtectedRoute = protectedRoutes.some(route => 
    req.nextUrl.pathname === route || req.nextUrl.pathname.startsWith(`${route}/`)
  );
  
  // Skip auth check for non-protected routes
  if (!isProtectedRoute) {
    return NextResponse.next();
  }
  
  console.log(`Auth middleware checking route: ${req.nextUrl.pathname}`);
  
  // Create a response to modify
  const res = NextResponse.next();
  
  try {
    // Create a Supabase client
    const supabase = createMiddlewareClient({ req, res });
    
    // Get the session
    const { data: { session } } = await supabase.auth.getSession();
    
    console.log(`Auth check result: Session exists: ${!!session}`);
    
    // If there's no session, redirect to signin
    if (!session) {
      console.log(`No session, redirecting to signin with returnTo=${req.nextUrl.pathname}`);
      return NextResponse.redirect(
        new URL(`/auth/signin?returnTo=${encodeURIComponent(req.nextUrl.pathname)}`, req.url)
      );
    }
    
    // User is authenticated, proceed
    return res;
  } catch (error) {
    console.error('Middleware error:', error);
    // On error, allow access rather than potentially creating a redirect loop
    return NextResponse.next();
  }
}

// Match all request paths except for the ones we don't want to check
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, images, public files
     * - api routes that don't need auth
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|api/public).*)',
  ],
};