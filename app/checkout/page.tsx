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
import { useTimeSelectionStore } from '@/app/store/useTimeSelectionStore';
import { Calendar } from "@/components/ui/calendar";
import TimePicker from "@/components/ui/time-picker";
import { CalendarIcon, Clock, MapPin, Utensils, Package } from 'lucide-react';

export default function CheckoutPage() {
  const { total } = useCart();
  const timeSelectionStore = useTimeSelectionStore();
  const orderType = timeSelectionStore.orderType;
  const router = useRouter();
  const [selectedZone, setSelectedZone] = useState<DeliveryZone | null>(null);
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [vehicleType, setVehicleType] = useState<'motorbike' | 'bicycle'>('motorbike');
  const supabase = createClientComponentClient();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [reservationDetails, setReservationDetails] = useState<{
    date: Date | null;
    time: string | null;
    guestCount?: number;
    notes?: string;
  }>({
    date: null,
    time: null,
    guestCount: 1,
    notes: ''
  });

  // Check if the order type is set
  useEffect(() => {
    const redirectIfOrderTypeNotSet = () => {
      console.log('Current order type:', orderType);
      if (!orderType) {
        console.log('Order type is not set, redirecting to home');
        router.push('/');
      }
    };

    const timeoutId = setTimeout(redirectIfOrderTypeNotSet, 100);
    return () => clearTimeout(timeoutId);
  }, [orderType, router]);

  // Reset selected zone when vehicle type changes
  useEffect(() => {
    if (orderType === 'delivery') {
      setSelectedZone(null);
      if (step === 2) {
        setStep(1);
      }
    }
  }, [vehicleType, orderType]);

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

  // Proceed to next step for reservation/pickup types
  const proceedToReviewStep = () => {
    if (!selectedDate) {
      toast.error('Please select a date');
      return;
    }
    
    if (!selectedTime) {
      toast.error('Please select a time');
      return;
    }
    
    // For dine-in, validate guest count
    if (orderType === 'dine-in' && (!reservationDetails.guestCount || reservationDetails.guestCount < 1)) {
      toast.error('Please enter a valid number of guests');
      return;
    }
    
    setReservationDetails({
      ...reservationDetails,
      date: selectedDate,
      time: selectedTime
    });
    
    setStep(2);
  };

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

  const handleVehicleTypeChange = (value: string) => {
    if (value === 'motorbike' || value === 'bicycle') {
      setVehicleType(value);
    }
  };

  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date || null);
  };

  const handleTimeChange = (time: string) => {
    setSelectedTime(time);
  };

  const handleGuestCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const count = parseInt(e.target.value);
    setReservationDetails({
      ...reservationDetails,
      guestCount: isNaN(count) ? 1 : count
    });
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReservationDetails({
      ...reservationDetails,
      notes: e.target.value
    });
  };

  // Get step title based on order type
  const getStepOneTitle = () => {
    switch (orderType) {
      case 'delivery':
        return 'Delivery Location';
      case 'pickup':
        return 'Pickup Time';
      case 'dine-in':
        return 'Reservation';
      default:
        return 'Location';
    }
  };

  // Get step icon based on order type
  const getStepOneIcon = () => {
    switch (orderType) {
      case 'delivery':
        return <MapPin className="w-4 h-4" />;
      case 'pickup':
        return <Package className="w-4 h-4" />;
      case 'dine-in':
        return <Utensils className="w-4 h-4" />;
      default:
        return <MapPin className="w-4 h-4" />;
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
          <div className="text-gray-500 mb-8 flex items-center">
            {orderType === 'delivery' && <span className="flex items-center"><MapPin className="w-4 h-4 mr-1" /> Delivery Order</span>}
            {orderType === 'pickup' && <span className="flex items-center"><Package className="w-4 h-4 mr-1" /> Pickup Order</span>}
            {orderType === 'dine-in' && <span className="flex items-center"><Utensils className="w-4 h-4 mr-1" /> Dine-in Reservation</span>}
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="space-y-8">
              {/* Vehicle Type Selection - Only show for Delivery */}
              {orderType === 'delivery' && (
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
              )}

              {/* Progress Steps */}
              <div className="flex justify-between items-center">
                <div className={`flex flex-col items-center ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
                  <div className={`w-10 h-10 flex items-center justify-center rounded-full border-2 mb-1 ${step >= 1 ? 'border-blue-600 bg-blue-50' : 'border-gray-300'}`}>
                    {getStepOneIcon()}
                  </div>
                  <span className="text-sm">{getStepOneTitle()}</span>
                </div>
                <div className="grow mx-2 h-1 bg-gray-200">
                  <div className={`h-full bg-blue-600 transition-all duration-500 ${step >= 2 ? 'w-full' : 'w-0'}`}></div>
                </div>
                <div className={`flex flex-col items-center ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
                  <div className={`w-10 h-10 flex items-center justify-center rounded-full border-2 mb-1 ${step >= 2 ? 'border-blue-600 bg-blue-50' : 'border-gray-300'}`}>
                    <Clock className="w-4 h-4" />
                  </div>
                  <span className="text-sm">Review & Pay</span>
                </div>
              </div>

              {/* Selected delivery method indicator - Only for Delivery */}
              {orderType === 'delivery' && selectedZone && (
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
                  {/* Delivery Options */}
                  {orderType === 'delivery' && (
                    <>
                      <h2 className="text-lg font-medium mb-4">Choose Delivery Location</h2>
                      <DeliveryZoneSelector 
                        onSelect={(zone) => {
                          setSelectedZone(zone);
                          setStep(2);
                        }}
                        branchIds={['b1000000-0000-0000-0000-000000000001', 'b2000000-0000-0000-0000-000000000002', 'b3000000-0000-0000-0000-000000000003']}
                        vehicleType={vehicleType}
                      />
                    </>
                  )}
                  
                  {/* Pickup/Dine-in Options */}
                  {(orderType === 'pickup' || orderType === 'dine-in') && (
                    <div className="space-y-6">
                      <h2 className="text-lg font-medium mb-4">
                        {orderType === 'pickup' ? 'Select Pickup Time' : 'Make a Reservation'}
                      </h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="bg-blue-50 rounded-lg p-4">
                            <h3 className="font-medium flex items-center mb-2 text-blue-800">
                              <CalendarIcon className="w-4 h-4 mr-2" />
                              Select Date
                            </h3>
                            <Calendar
                              mode="single"
                              selected={selectedDate || undefined}
                              onSelect={handleDateChange}
                              className="rounded-md border bg-white"
                              initialFocus
                              disabled={{ before: new Date() }}
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="bg-blue-50 rounded-lg p-4">
                            <h3 className="font-medium flex items-center mb-2 text-blue-800">
                              <Clock className="w-4 h-4 mr-2" />
                              Select Time
                            </h3>
                            <TimePicker
                              onChange={handleTimeChange}
                              value={selectedTime}
                              hourRange={{ start: 10, end: 22 }}
                              className="mb-4"
                            />
                            
                            {orderType === 'dine-in' && (
                              <div className="mt-4 space-y-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Number of Guests
                                  </label>
                                  <input
                                    type="number"
                                    min="1"
                                    value={reservationDetails.guestCount}
                                    onChange={handleGuestCountChange}
                                    className="w-full p-2 border rounded-md"
                                  />
                                </div>
                                
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Special Requests (Optional)
                                  </label>
                                  <textarea
                                    value={reservationDetails.notes}
                                    onChange={handleNotesChange}
                                    className="w-full p-2 border rounded-md"
                                    rows={3}
                                    placeholder="Any special requests or dietary requirements..."
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <button
                        onClick={proceedToReviewStep}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition-colors"
                      >
                        Continue to Review
                      </button>
                    </div>
                  )}
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
                  
                  {/* Show reservation details for pickup/dine-in */}
                  {(orderType === 'pickup' || orderType === 'dine-in') && reservationDetails.date && reservationDetails.time && (
                    <div className="bg-blue-50 p-4 rounded-lg mb-6">
                      <h3 className="font-medium text-blue-800 mb-2">
                        {orderType === 'pickup' ? 'Pickup Details' : 'Reservation Details'}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center">
                          <CalendarIcon className="w-4 h-4 mr-2 text-blue-600" />
                          <span>{reservationDetails.date.toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2 text-blue-600" />
                          <span>{reservationDetails.time}</span>
                        </div>
                        
                        {orderType === 'dine-in' && (
                          <>
                            <div className="flex items-center">
                              <Utensils className="w-4 h-4 mr-2 text-blue-600" />
                              <span>{reservationDetails.guestCount} {reservationDetails.guestCount === 1 ? 'Guest' : 'Guests'}</span>
                            </div>
                            {reservationDetails.notes && (
                              <div className="col-span-2 mt-2">
                                <p className="text-sm font-medium text-gray-700">Special Requests:</p>
                                <p className="text-sm text-gray-600">{reservationDetails.notes}</p>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  )}
                  
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
                      ← Back to {orderType === 'delivery' ? 'delivery options' : orderType === 'pickup' ? 'pickup options' : 'reservation details'}
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