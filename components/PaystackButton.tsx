'use client';

import { useEffect } from 'react';
import type { DeliveryZone } from '@/types/checkout';
import Image from 'next/image';

interface PaystackButtonProps {
  amount: number;
  email: string;
  deliveryZone: DeliveryZone | null;
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

declare const PaystackPop: {
  setup: (config: {
    key: string;
    email: string;
    amount: number;
    ref: string;
    metadata: any;
    callback: (response: PaystackSuccessResponse) => void;
    onClose: () => void;
  }) => { openIframe: () => void };
};

export function PaystackButton({ amount, email, deliveryZone }: PaystackButtonProps) {
  useEffect(() => {
    // Load Paystack script
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = () => {
    const handler = PaystackPop.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '',
      email,
      amount: amount * 100, // Convert to kobo
      ref: new Date().getTime().toString(),
      metadata: {
        deliveryZone
      },
      callback: (response: PaystackSuccessResponse) => {
        console.log("Payment successful!", response);
        // Handle successful payment
        // You might want to redirect to a success page or update order status
      },
      onClose: () => {
        console.log("Payment modal closed");
        // Handle modal close
      }
    });

    handler.openIframe();
  };

  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div className="w-full flex flex-col items-center">
      <button 
        onClick={handlePayment}
        className="w-full bg-green-500 text-white py-4 px-8 rounded-lg font-semibold shadow-lg hover:bg-green-600 transition-colors"
      >
        Pay ₦{formatPrice(amount)}
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