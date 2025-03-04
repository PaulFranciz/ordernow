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
import { DeliveryZone } from '@/types/checkout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function CheckoutPage() {
  const { total } = useCart(); // Remove cart as we don't need to pass it to CartSummary
  const [selectedZone, setSelectedZone] = useState<DeliveryZone | null>(null);
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [vehicleType, setVehicleType] = useState<'motorbike' | 'bicycle'>('motorbike');
  const router = useRouter();
  const supabase = createClientComponentClient();

  // Reset selected zone when vehicle type changes
  useEffect(() => {
    // Clear the selected zone when the vehicle type changes
    setSelectedZone(null);
    // If already on step 2, go back to step 1 to select a new zone
    if (step === 2) {
      setStep(1);
    }
  }, [vehicleType]);

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
        
        if (session.user.email) {
          setUser({ email: session.user.email });
        }
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

  // Type-safe handler for the tabs value change
  const handleVehicleTypeChange = (value: string) => {
    if (value === 'motorbike' || value === 'bicycle') {
      setVehicleType(value);
    }
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
              {/* Vehicle Type Selection */}
              <div>
                <h2 className="text-lg font-medium mb-3">Select Delivery Method</h2>
                <Tabs defaultValue="motorbike" onValueChange={handleVehicleTypeChange} value={vehicleType}>
                  <TabsList className="grid grid-cols-2">
                    <TabsTrigger value="motorbike">Motorbike</TabsTrigger>
                    <TabsTrigger value="bicycle">Bicycle</TabsTrigger>
                  </TabsList>
                  <TabsContent value="motorbike">
                    <div className="text-sm text-gray-600 mt-2 p-3 bg-blue-50 rounded-md">
                      <p>Faster delivery with our motorbike service.</p>
                      <p className="mt-1 text-xs text-gray-500">Available in more areas, standard delivery fees apply.</p>
                    </div>
                  </TabsContent>
                  <TabsContent value="bicycle">
                    <div className="text-sm text-gray-600 mt-2 p-3 bg-green-50 rounded-md">
                      <p>Eco-friendly delivery with our bicycle service.</p>
                      <p className="mt-1 text-xs text-gray-500">Reduced environmental impact, may have limited delivery range.</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Progress Steps */}
              <div className="flex justify-between items-center">
                <div className={`flex flex-col items-center ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 flex items-center justify-center rounded-full border-2 mb-1 ${step >= 1 ? 'border-blue-600 bg-blue-50' : 'border-gray-300'}`}>
                    1
                  </div>
                  <span className="text-sm">Delivery Location</span>
                </div>
                <div className="grow mx-2 h-1 bg-gray-200">
                  <div className={`h-full bg-blue-600 transition-all duration-500 ${step >= 2 ? 'w-full' : 'w-0'}`}></div>
                </div>
                <div className={`flex flex-col items-center ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 flex items-center justify-center rounded-full border-2 mb-1 ${step >= 2 ? 'border-blue-600 bg-blue-50' : 'border-gray-300'}`}>
                    2
                  </div>
                  <span className="text-sm">Review & Pay</span>
                </div>
              </div>

              {/* Selected vehicle type indicator */}
              {selectedZone && (
                <div className="rounded-md bg-gray-50 p-3 text-sm">
                  <p className="text-gray-700">
                    <span className="font-medium">Selected Delivery Method:</span> {vehicleType === 'motorbike' ? 'Motorbike' : 'Bicycle'}
                  </p>
                </div>
              )}

              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mt-6"
                >
                  <h2 className="text-lg font-medium mb-4">Choose Delivery Location</h2>
                  <DeliveryZoneSelector 
                    onSelect={(zone) => {
                      setSelectedZone(zone);
                      setStep(2);
                    }}
                    branchIds={['b1000000-0000-0000-0000-000000000001', 'b2000000-0000-0000-0000-000000000002', 'b3000000-0000-0000-0000-000000000003']}
                    vehicleType={vehicleType}
                  />
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mt-6"
                >
                  <h2 className="text-lg font-medium mb-4">Order Summary</h2>
                  {/* Updated: Remove cart prop, since CartSummary will use the hook internally */}
                  <CartSummary deliveryZone={selectedZone} />
                  
                  <div className="mt-6">
                    <PaystackButton 
                      amount={total + (selectedZone?.daytime_fee || 0)} 
                      email={user?.email || ''}
                      deliveryZone={selectedZone}
                    />
                    
                    <button 
                      onClick={() => setStep(1)}
                      className="w-full mt-3 py-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      ← Back to delivery options
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}