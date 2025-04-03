// app/auth/callback/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  console.log(`[Auth Callback] Received GET request for URL: ${request.url}`);
  try {
    // Get the URL and extract parameters
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');
    const returnTo = requestUrl.searchParams.get('returnTo') || '/checkout';
    const origin = new URL(request.headers.get('referer') || request.url).origin;
    
    console.log(`Auth callback started with code ${code ? 'present' : 'missing'} and returnTo=${returnTo}`);
    console.log(`Detected origin: ${origin}`);
    
    if (!code) {
      console.error('No code in callback URL');
      // Return HTML that will redirect the user using client-side JavaScript with the correct origin
      return new NextResponse(
        `<!DOCTYPE html>
        <html>
          <head>
            <title>Authentication Failed</title>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <script>
              // Store auth state to local storage
              localStorage.setItem('authError', 'missing_code');
              
              // Get the server address from where this page was served
              const serverOrigin = window.location.origin;
              const redirectPath = "/auth/signin?error=missing_code&returnTo=${encodeURIComponent(returnTo)}";
              const fullRedirectUrl = serverOrigin + redirectPath;
              
              console.log("Redirecting to:", fullRedirectUrl);
              window.location.href = fullRedirectUrl;
            </script>
          </head>
          <body>
            <p>Authentication failed. Redirecting...</p>
          </body>
        </html>`,
        {
          headers: {
            'Content-Type': 'text/html',
          },
        }
      );
    }
    
    // Create a Supabase client with secure cookie handling
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    // Exchange the code for a session
    console.log('Exchanging code for session...');
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      console.error('Error exchanging code for session:', error);
      // Return HTML that will redirect the user using client-side JavaScript with the correct origin
      return new NextResponse(
        `<!DOCTYPE html>
        <html>
          <head>
            <title>Authentication Failed</title>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <script>
              // Store auth state to local storage
              localStorage.setItem('authError', ${JSON.stringify(error.message)});
              
              // Get the server address from where this page was served
              const serverOrigin = window.location.origin;
              const redirectPath = "/auth/signin?error=${encodeURIComponent(error.message)}&returnTo=${encodeURIComponent(returnTo)}";
              const fullRedirectUrl = serverOrigin + redirectPath;
              
              console.log("Redirecting to:", fullRedirectUrl);
              window.location.href = fullRedirectUrl;
            </script>
          </head>
          <body>
            <p>Authentication failed. Redirecting...</p>
          </body>
        </html>`,
        {
          headers: {
            'Content-Type': 'text/html',
          },
        }
      );
    }
    
    // Verify session was created
    const { data } = await supabase.auth.getSession();
    
    if (!data.session) {
      console.error('No session after code exchange');
      // Return HTML that will redirect the user using client-side JavaScript with the correct origin
      return new NextResponse(
        `<!DOCTYPE html>
        <html>
          <head>
            <title>Authentication Failed</title>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <script>
              // Store auth state to local storage
              localStorage.setItem('authError', 'no_session');
              
              // Get the server address from where this page was served
              const serverOrigin = window.location.origin;
              const redirectPath = "/auth/signin?error=no_session&returnTo=${encodeURIComponent(returnTo)}";
              const fullRedirectUrl = serverOrigin + redirectPath;
              
              console.log("Redirecting to:", fullRedirectUrl);
              window.location.href = fullRedirectUrl;
            </script>
          </head>
          <body>
            <p>Authentication failed. Redirecting...</p>
          </body>
        </html>`,
        {
          headers: {
            'Content-Type': 'text/html',
          },
        }
      );
    }
    
    console.log('Successfully authenticated, redirecting to verification page with returnTo:', returnTo);
    
    // Redirect to the verification page, passing returnTo
    const verifyUrl = new URL('/auth/verify', requestUrl.origin);
    verifyUrl.searchParams.set('returnTo', returnTo);
    return NextResponse.redirect(verifyUrl.toString());

  } catch (error) {
    console.error('Callback error:', error);
    
    const requestUrl = new URL(request.url);
    const returnTo = requestUrl.searchParams.get('returnTo') || '/checkout';
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    // Return HTML that will redirect the user using client-side JavaScript with the correct origin
    return new NextResponse(
      `<!DOCTYPE html>
      <html>
        <head>
          <title>Authentication Error</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <script>
            // Store auth state to local storage
            localStorage.setItem('authError', ${JSON.stringify(errorMessage)});
            
            // Get the server address from where this page was served
            const serverOrigin = window.location.origin;
            const redirectPath = "/auth/signin?error=${encodeURIComponent(errorMessage)}&returnTo=${encodeURIComponent(returnTo)}";
            const fullRedirectUrl = serverOrigin + redirectPath;
            
            console.log("Redirecting to:", fullRedirectUrl);
            window.location.href = fullRedirectUrl;
          </script>
        </head>
        <body>
          <p>Authentication error. Redirecting...</p>
        </body>
      </html>`,
      {
        headers: {
          'Content-Type': 'text/html',
        },
      }
    );
  }
}