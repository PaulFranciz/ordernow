'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CloudinaryImage } from '@/components/ui/cloudinary-image';
import { DeliveryZone } from '@/types/checkout';
import { useCart } from '@/hooks/useCart';

interface CartSummaryProps {
  deliveryZone: DeliveryZone | null;
  showImages?: boolean;
}

export function CartSummary({ deliveryZone, showImages = false }: CartSummaryProps) {
  const { cart, total: subtotal } = useCart();
  
  const deliveryFee = deliveryZone?.daytime_fee || 0;
  const total = subtotal + deliveryFee;

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } }
  };

  const itemFade = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  };

  // More robust empty check
  if (!cart || cart.length === 0) {
    return (
      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        className="bg-gray-50 rounded-lg p-6 mb-8"
      >
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        <div className="text-center text-gray-500 py-6">
          Your cart is empty
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      className="bg-gray-50 rounded-lg p-6 mb-8"
    >
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#BF9B30] to-[#DFBD69]">
          Order Summary
        </span>
      </h2>
      
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {cart.map((item) => (
            <motion.div
              key={item.id}
              variants={itemFade}
              whileHover={{ x: 5 }}
              className={`flex ${showImages ? 'items-start gap-3' : 'justify-between items-center'}`}
            >
              {showImages && (
                <div className="h-12 w-12 relative rounded-lg overflow-hidden flex-shrink-0">
                  <CloudinaryImage
                    src={item.image || `https://placehold.co/400x300/1a1a1a/BF9B30/webp?text=${encodeURIComponent(item.name)}`}
                    alt={item.name}
                    width={48}
                    height={48}
                    className="object-cover h-full w-full"
                  />
                </div>
              )}
              <div className={showImages ? "flex-1 min-w-0" : ""}>
                <span className="text-sm md:text-base line-clamp-1">
                  {item.name} × {item.quantity}
                </span>
              </div>
              <span className="text-sm md:text-base font-medium">
                ₦{(item.price * item.quantity).toLocaleString()}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>

        <motion.div 
          variants={fadeIn}
          className="border-t pt-4 mt-4"
        >
          <div className="flex justify-between mb-2">
            <span>Subtotal</span>
            <span>₦{subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Delivery Fee</span>
            <span>{deliveryFee > 0 ? `₦${deliveryFee.toLocaleString()}` : 'Free'}</span>
          </div>
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#BF9B30] to-[#DFBD69]">
              ₦{total.toLocaleString()}
            </span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}