'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { Mail } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { useState } from 'react';

export function SignInWithGoogle() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      
      // Get returnTo from URL or default to checkout
      const params = new URLSearchParams(window.location.search);
      const returnTo = params.get('returnTo') || '/checkout';
      
      // Get the current origin
      const origin = window.location.origin;
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${origin}/auth/callback?returnTo=${encodeURIComponent(returnTo)}`,
        },
      });
      
      if (error) throw error;
    } catch (error) {
      console.error('Sign in error:', error);
      toast.error('Failed to sign in with Google');
    } finally {
      setIsLoading(false);
    }
  };
    
  return (
    <button 
      onClick={handleGoogleSignIn}
      disabled={isLoading}
      className="w-full flex items-center justify-center gap-2 bg-white text-gray-700 p-3 rounded-lg border hover:bg-gray-50 transition-colors disabled:opacity-70"
    >
      <FcGoogle className="w-5 h-5" />
      {isLoading ? 'Signing in...' : 'Continue with Google'}
    </button>
  );
}

export function SignInWithEmail() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      
      // Get returnTo from URL or default to checkout
      const params = new URLSearchParams(window.location.search);
      const returnTo = params.get('returnTo') || '/checkout';
      
      // Get the current origin
      const origin = window.location.origin;
      
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${origin}/auth/callback?returnTo=${encodeURIComponent(returnTo)}`,
        },
      });
      
      if (error) throw error;

      setIsSent(true);
      toast.success('Check your email for the login link!');
    } catch (error) {
      console.error('Sign in error:', error);
      toast.error('Failed to send login link');
    } finally {
      setIsLoading(false);
    }
  };
    
  return (
    <form onSubmit={handleSignIn} className="w-full space-y-4">
      <div className="relative">
        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full pl-9 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          disabled={isLoading || isSent}
        />
      </div>
      <button 
        type="submit"
        disabled={isLoading || isSent}
        className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-70"
      >
        {isLoading ? 'Sending...' : isSent ? 'Check your email' : 'Continue with Email'}
      </button>
      {isSent && (
        <p className="text-sm text-center text-gray-600">
          We've sent a login link to {email}
        </p>
      )}
    </form>
  );
}