'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

export default function AuthErrorPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full mx-4 p-8 bg-white rounded-xl shadow-xl"
      >
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="p-3 bg-red-100 rounded-full">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Authentication Error</h1>
          <p className="text-gray-500">
            We encountered an error while trying to authenticate you. Please try again or contact support if the problem persists.
          </p>
          <div className="flex gap-4 mt-6">
            <Button
              variant="outline"
              onClick={() => router.back()}
            >
              Go Back
            </Button>
            <Button
              className="bg-gradient-to-r from-[#BF9B30] to-[#DFBD69] text-white"
              onClick={() => router.push('/')}
            >
              Return Home
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 