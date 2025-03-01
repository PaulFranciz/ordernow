import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');
    const error = requestUrl.searchParams.get('error');
    const error_description = requestUrl.searchParams.get('error_description');

    if (error || !code) {
      throw new Error(error_description || 'No code provided');
    }

    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    const { error: supabaseError } = await supabase.auth.exchangeCodeForSession(code);

    if (supabaseError) {
      throw supabaseError;
    }

    // Get the return URL if it exists
    const returnTo = requestUrl.searchParams.get('returnTo') || '/';
    return NextResponse.redirect(`${requestUrl.origin}${returnTo}`);

  } catch (error) {
    console.error('Auth callback error:', error);
    const errorUrl = new URL('/auth/error', request.url);
    errorUrl.searchParams.set('error', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.redirect(errorUrl);
  }
} 