'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useCart } from '@/hooks/useCart';
import { PaystackButton } from '@/components/PaystackButton';
import { DeliveryZoneSelector } from '@/components/checkout/DeliveryZoneSelector';
import { CartSummary } from '@/components/checkout/CartSummary';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { toast } from 'react-hot-toast';

interface DeliveryZone {
  id: string;
  name: string;
  daytime_fee: number;
  // Add other properties your DeliveryZone has
}

export default function CheckoutPage() {
  const { cart, total } = useCart();
  const [selectedZone, setSelectedZone] = useState<DeliveryZone | null>(null);
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<{ email: string } | null>(null);
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        if (!session) {
          localStorage.setItem('authRedirectPath', '/checkout');
          router.push('/auth/signin');
          return;
        }
        
        setUser({ email: session.user.email || '' });
        setIsLoading(false);
      } catch (error) {
        console.error('Auth check error:', error);
        toast.error('Authentication error. Please try again.');
        router.push('/auth/signin');
      }
    };

    checkAuth();
  }, [router, supabase.auth]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="max-w-2xl mx-auto"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
          
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="space-y-8">
              {/* Progress Steps */}
              <div className="flex justify-between items-center mb-8">
                <motion.div 
                  className={`step ${step >= 1 ? 'active' : ''}`}
                  animate={{ scale: step === 1 ? 1.1 : 1 }}
                >
                  1. Delivery Location
                </motion.div>
                <motion.div 
                  className={`step ${step >= 2 ? 'active' : ''}`}
                  animate={{ scale: step === 2 ? 1.1 : 1 }}
                >
                  2. Review & Pay
                </motion.div>
              </div>

              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <DeliveryZoneSelector 
                    onSelect={(zone) => {
                      setSelectedZone(zone);
                      setStep(2);
                    }}
                  />
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <CartSummary cart={cart} deliveryZone={selectedZone} />
                  <PaystackButton 
                    amount={total + (selectedZone?.daytime_fee || 0)} 
                    email={user?.email}
                    deliveryZone={selectedZone}
                  />
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 