import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function middleware(request: NextRequest) {
  // Log the request for debugging
  console.log('Middleware request:', {
    url: request.url,
    pathname: request.nextUrl.pathname
  });

  // Skip auth for public routes and API routes
  if (
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.startsWith('/api/') ||
    request.nextUrl.pathname === '/' ||
    request.nextUrl.pathname.startsWith('/static') ||
    request.nextUrl.pathname.startsWith('/order')
  ) {
    console.log('Skipping auth for public route:', request.nextUrl.pathname);
    return NextResponse.next();
  }

  const sessionToken = request.cookies.get('session_token')?.value;

  if (!sessionToken) {
    console.log('No session token found, redirecting to home');
    return NextResponse.redirect(new URL('/', request.url));
  }

  try {
    // Verify session
    const { data: session, error } = await supabase
      .from('sessions')
      .select('user_id, expires_at')
      .eq('session_token', sessionToken)
      .single();

    if (error || !session || new Date(session.expires_at) < new Date()) {
      // Clear invalid session
      console.log('Invalid or expired session, redirecting to home');
      const response = NextResponse.redirect(new URL('/', request.url));
      response.cookies.delete('session_token');
      return response;
    }

    // Session is valid, continue
    return NextResponse.next();
  } catch (error) {
    console.error('Error in auth middleware:', error);
    return NextResponse.redirect(new URL('/', request.url));
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public directory)
     * - api routes (all API endpoints)
     * - order routes (menu pages)
     */
    '/((?!_next/static|_next/image|favicon.ico|api|order).*)',
  ],
}; 