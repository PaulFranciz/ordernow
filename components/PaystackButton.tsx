'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useCart } from '@/lib/hooks/use-cart';
import type { DeliveryZone } from '@/types/checkout';
import Image from 'next/image';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { OrderType } from '@/types/order';

interface PaystackButtonProps {
  amount: number;
  email: string;
  deliveryZone: DeliveryZone | null;
  orderType?: OrderType;
  branchId: string | null;
}

interface PaystackSuccessResponse {
  reference: string;
  trans: string;
  status: string;
  message: string;
  transaction: string;
  trxref: string;
  redirecturl: string;
}

declare global {
  interface Window {
    PaystackPop: {
      setup: (config: {
        key: string;
        email: string;
        amount: number;
        ref: string;
        metadata: any;
        callback: (response: PaystackSuccessResponse) => void;
        onClose: () => void;
      }) => { openIframe: () => void };
    }
  }
}

export function PaystackButton({
  amount,
  email,
  deliveryZone,
  orderType,
  branchId,
}: PaystackButtonProps) {
  const router = useRouter();
  const { items } = useCart();
  const supabase = createClientComponentClient();
  const [isLoading, setIsLoading] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    // Load Paystack script
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    
    script.onload = () => {
      console.log('Paystack script loaded successfully');
      setScriptLoaded(true);
    };
    
    script.onerror = () => {
      console.error('Failed to load Paystack script');
      toast.error('Payment system unavailable. Please try again later.');
    };
    
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handlePayment = async () => {
    setIsLoading(true);
    console.log('Payment process started', { orderType, branchId, deliveryZone });
    
    try {
      // Add extra logging right after the PaystackPop check
      console.log('Checking authentication...');
      
      // Check authentication first
      const { data: { session }, error: authError } = await supabase.auth.getSession();
      console.log('Auth check complete:', { 
        hasSession: !!session, 
        hasError: !!authError 
      });
      
      if (!session || authError) {
        console.error('Authentication error:', authError);
        toast.error('Please sign in to continue');
        router.push('/auth/signin?returnTo=/checkout');
        setIsLoading(false);
        return;
      }

      // Add these console logs right after the authentication check
      console.log('Authentication successful, validating order details...');

      // --- Refined Validation Logic ---
      // 1. Check if a branch/location is selected (likely needed for all types)
      if (!branchId) {
        toast.error('Please select a branch or location');
        setIsLoading(false);
        return;
      }

      // 2. If it's a delivery order, ensure a delivery zone is selected
      if (orderType === 'delivery' && !deliveryZone) {
        toast.error('Please select a delivery zone for delivery orders');
        setIsLoading(false);
        return;
      }

      // 3. Check if cart is empty
      console.log('[PaystackButton] Checking cart items:', { cartItems: items, length: items?.length });
      if (!items || items.length === 0) {
        console.log('[PaystackButton] Cart is empty, stopping payment process.');
        toast.error('Your cart is empty');
        setIsLoading(false);
        return;
      }
      console.log('[PaystackButton] Cart check passed. Proceeding...');
      // --- End of Refined Validation Logic ---

      // Add right before each validation check
      console.log('Delivery zone check:', { 
        hasDeliveryZone: !!deliveryZone,
        zoneData: deliveryZone
      });

      console.log('Validation passed. Creating order...');
      // Create order with auth header
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          branch_id: branchId,
          order_type: orderType,
          ...(orderType === 'delivery' && deliveryZone && { delivery_zone_id: deliveryZone.id }),
          items,
          special_instructions: ''
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Order creation failed:', errorData);
        throw new Error(errorData.error || 'Failed to create order');
      }

      const { order } = await response.json();
      if (!order) throw new Error('Failed to create order');
      
      console.log('Order created successfully:', order.id);
      
      // Make sure NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY is defined
      const paystackKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
      if (!paystackKey) {
        console.error('Paystack public key is not defined');
        throw new Error('Payment configuration error');
      }

      console.log('Environment variables and order details check:', {
        hasPaystackKey: !!process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
        paymentAmount: amount,
        paymentEmail: email,
        orderType,
        branchId,
        deliveryZoneInfo: deliveryZone ? { id: deliveryZone.id, name: deliveryZone.name } : null,
        itemsCount: items?.length || 0
      });

      if (typeof window === 'undefined' || !window.PaystackPop || !scriptLoaded) {
        console.error('Paystack not available globally', { 
          windowExists: typeof window !== 'undefined',
          payStackExists: typeof window !== 'undefined' && !!window.PaystackPop
        });
        toast.error('Payment system is not available. Please try again later.');
        setIsLoading(false);
        return;
      }

      console.log('Initializing Paystack...');
      
      // Some browsers or extensions might block access to PaystackPop
      const handler = window.PaystackPop.setup({
        key: paystackKey,
        email,
        amount: Math.round(amount * 100), // Convert to kobo and ensure it's an integer
        ref: `ord_${order.id}_${Date.now()}`,
        metadata: {
          orderId: order.id
        },
        callback: function(response: PaystackSuccessResponse) {
          console.log('Payment callback received:', response);
          // The callback might not have access to the outer scope in some cases
          // so we'll use a more direct approach
          window.location.href = `/order/confirmation/${order.id}`;
        },
        onClose: function() {
          console.log("Payment window closed");
          // Reset loading state manually through a global function
          window.setTimeout(function() {
            setIsLoading(false);
          }, 100);
        }
      });

      console.log('Handler created, opening iframe...');
      handler.openIframe();

      // Add after all validations pass
      console.log('All validations passed, about to create order');

      // Check network request explicitly
      console.log('Order request payload:', {
        branch_id: branchId,
        order_type: orderType,
        delivery_zone_id: orderType === 'delivery' ? deliveryZone?.id : null,
        itemsCount: items?.length
      });
    } catch (error) {
      // Add a catch-all error handler that will show exactly what's going wrong
      console.error('Unexpected error in payment process:', error);
      toast.error('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div className="w-full flex flex-col items-center">
      <button
        onClick={handlePayment}
        disabled={isLoading || !scriptLoaded}
        className={`w-full py-3 ${
          isLoading || !scriptLoaded ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#BF9B30] hover:bg-[#A88929]'
        } text-white rounded-md transition-colors duration-200`}
      >
        {isLoading ? 'Processing...' : scriptLoaded ? `Pay ₦${formatPrice(amount)}` : 'Initializing Payment...'}
      </button>
      <div className="mt-3 flex items-center text-sm text-gray-600">
        <span>Secured by</span>
        <Image
          src="/logo/Paystack_idSL4BuSLF_1.png"
          alt="Paystack Logo"
          width={80}
          height={20}
          className="ml-1"
        />
      </div>
    </div>
  );
}