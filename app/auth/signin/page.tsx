'use client';

import { useSearchParams } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { SignInWithGoogle } from '@/components/auth/SignInWithGoogle';

export default function SignIn() {
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo') || '/';

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="w-full max-w-md space-y-8 px-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Sign In</h2>
          <p className="mt-2 text-gray-600">to continue to checkout</p>
        </div>
        <SignInWithGoogle />
      </div>
    </div>
  );
} 