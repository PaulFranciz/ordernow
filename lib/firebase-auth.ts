import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // Check if the path is protected (e.g., /checkout)
  const isProtectedPath = path === '/checkout';

  // Get Firebase authentication cookie
  const firebaseToken = request.cookies.get('firebase-token')?.value;

  // If the path is protected and there's no token, redirect to signin
  if (isProtectedPath && !firebaseToken) {
    // Create a URL for the signin page
    const signinUrl = new URL('/auth/signin', request.url);
    
    // Add the original URL as a parameter for redirection after authentication
    signinUrl.searchParams.set('returnTo', '/checkout');
    
    // Redirect to the signin page
    return NextResponse.redirect(signinUrl);
  }

  // If we're on the signin page and have a token, redirect to checkout
  if (path === '/auth/signin' && firebaseToken) {
    const returnTo = request.nextUrl.searchParams.get('returnTo') || '/checkout';
    const redirectUrl = new URL(returnTo, request.url);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

// Configure the paths that should be handled by the middleware
export const config = {
  matcher: ['/checkout', '/auth/signin']
};

export const setAuthCookie = (token: string) => {
    // Set the authentication cookie with the provided token
    document.cookie = `authToken=${token}; path=/;`;
};