'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Image from 'next/image';

// Add GoogleIcon component
const GoogleIcon = () => (
  <Image
    src="/google-icon.svg"
    alt="Google"
    width={20}
    height={20}
  />
);

export function SignInWithGoogle() {
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleGoogleSignIn = async () => {
    try {
      // Store the intended redirect path before initiating OAuth
      const returnPath = window.location.pathname;
      localStorage.setItem('authRedirectPath', returnPath);

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) throw error;

    } catch (error) {
      console.error('Sign in error:', error);
      toast.error('Failed to sign in with Google', {
        id: 'signin-error',
        duration: 4000,
        style: {
          background: '#FEE2E2',
          color: '#DC2626',
        },
      });
    }
  };

  return (
    <button 
      onClick={handleGoogleSignIn}
      className="w-full flex items-center justify-center gap-2 bg-white text-gray-800 p-3 rounded-lg border hover:bg-gray-50 transition-colors"
    >
      <GoogleIcon />
      Continue with Google
    </button>
  );
}