import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = createRouteHandlerClient({ cookies });
    
    try {
      await supabase.auth.exchangeCodeForSession(code);
      
      // Get the stored redirect path or default to '/'
      const redirectPath = requestUrl.searchParams.get('redirectPath') || '/checkout';
      
      return NextResponse.redirect(new URL(redirectPath, requestUrl.origin));
    } catch (error) {
      console.error('Auth callback error:', error);
      return NextResponse.redirect(
        new URL('/auth/signin?error=Authentication%20failed', requestUrl.origin)
      );
    }
  }

  // If no code, redirect to signin with error
  return NextResponse.redirect(
    new URL('/auth/signin?error=No%20code%20provided', requestUrl.origin)
  );
}