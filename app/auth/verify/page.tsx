'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// Inner component that uses useSearchParams
function VerifyClientComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClientComponentClient();

  useEffect(() => {
    let redirected = false;
    // Decode returnTo parameter just in case
    const returnToParam = searchParams.get('returnTo');
    const returnTo = returnToParam ? decodeURIComponent(returnToParam) : '/'; // Default to homepage

    console.log('[VerifyPage] Mounted. Waiting for session. Target:', returnTo);

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('[VerifyPage] Auth state change:', event, 'Session:', !!session);
      if (session && !redirected) {
        console.log('[VerifyPage] Session confirmed via listener. Redirecting to:', returnTo);
        redirected = true;
        // Use replace to avoid adding /auth/verify to browser history
        router.replace(returnTo);
      } else if (event === 'SIGNED_OUT' && !redirected) {
        // If the user somehow signs out while on this page, send to signin
        console.log('[VerifyPage] Signed out detected. Redirecting to signin.');
        redirected = true;
        router.replace('/auth/signin');
      }
      // If INITIAL_SESSION or other events without a session, we keep waiting.
      // The target page should be protected by middleware anyway.
    });

    // Initial check in case the listener is slow or state is already present
    // But prioritize the listener to ensure full state propagation
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('[VerifyPage] getSession initial check. Session:', !!session);
      if (session && !redirected) {
         // Add a small delay to allow onAuthStateChange to potentially fire first
         setTimeout(() => {
             if (!redirected) {
                console.log('[VerifyPage] Session confirmed via getSession (fallback). Redirecting to:', returnTo);
                redirected = true;
                router.replace(returnTo);
             }
         }, 100); // 100ms delay
      }
    });

    // Cleanup listener
    return () => {
      console.log('[VerifyPage] Unmounting, unsubscribing listener.');
      authListener.subscription.unsubscribe();
    };
  }, [router, searchParams, supabase]);

  // Display loading indicator while waiting for redirect
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
      <p className="text-lg text-gray-700">Verifying your session...</p>
      <p className="text-sm text-gray-500 mt-2">Please wait, you will be redirected shortly.</p>
    </div>
  );
}

// Default export wraps the client component in Suspense
export default function VerifyPage() {
  return (
    <Suspense fallback={
      // Basic fallback while Suspense boundary is resolving
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-400 mb-4"></div>
        <p className="text-lg text-gray-700">Loading...</p>
      </div>
    }>
      <VerifyClientComponent />
    </Suspense>
  );
}