'use client';

import { motion } from 'framer-motion';
import type { CartItem, DeliveryZone } from '@/types/checkout';

interface CartSummaryProps {
  cart: CartItem[];
  deliveryZone: DeliveryZone | null;
}

export function CartSummary({ cart, deliveryZone }: CartSummaryProps) {
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = deliveryZone?.daytime_fee || 0;
  const total = subtotal + deliveryFee;

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      className="bg-gray-50 rounded-lg p-6 mb-8"
    >
      <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
      
      <div className="space-y-4">
        {cart.map((item) => (
          <motion.div
            key={item.id}
            whileHover={{ x: 5 }}
            className="flex justify-between"
          >
            <span>{item.quantity}x {item.name}</span>
            <span>₦{item.price * item.quantity}</span>
          </motion.div>
        ))}

        <div className="border-t pt-4 mt-4">
          <div className="flex justify-between mb-2">
            <span>Subtotal</span>
            <span>₦{subtotal}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Delivery Fee</span>
            <span>₦{deliveryFee}</span>
          </div>
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>₦{total}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
} 