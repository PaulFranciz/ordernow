'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function CheckoutButton() {
  const router = useRouter();

  const handleCheckout = () => {
    // Set the returnTo cookie directly before navigation
    document.cookie = `returnTo=/checkout;path=/;max-age=300`;
    router.push('/order/time-selection');
  };

  return (
    <button 
      onClick={handleCheckout}
      className="..."
    >
      Proceed to Checkout
    </button>
  );
} 