'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CloudinaryImage } from '@/components/ui/cloudinary-image';
import { DeliveryZone } from '@/types/checkout';
import { useCart, CartItem, useCartTotal } from '@/lib/hooks/use-cart';

interface CartSummaryProps {
  deliveryZone: DeliveryZone | null;
}

export function CartSummary({ deliveryZone }: CartSummaryProps) {
  const { items } = useCart();
  const totalAmount = useCartTotal();

  const deliveryFee = deliveryZone?.daytime_fee || 0;
  const grandTotal = totalAmount + deliveryFee;

  return (
    <Card className="shadow-none border border-gray-200">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[200px] px-6">
          {items.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Your cart is empty</p>
          ) : (
            <div className="space-y-3">
              {items.map((item: CartItem) => (
                <div key={item.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                      <CloudinaryImage
                        src={item.image_url || `https://placehold.co/100x100/1a1a1a/BF9B30/webp?text=${encodeURIComponent(item.name)}`}
                        alt={item.name}
                        width={50}
                        height={50}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-sm line-clamp-1">{item.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="text-sm font-semibold">₦{(item.price * item.quantity).toLocaleString()}</p>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
        <div className="p-6 border-t border-gray-200 mt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>₦{totalAmount.toLocaleString()}</span>
          </div>
          {deliveryZone && (
            <div className="flex justify-between text-sm">
              <span>Delivery Fee ({deliveryZone.name})</span>
              <span>₦{deliveryFee.toLocaleString()}</span>
            </div>
          )}
          <Separator />
          <div className="flex justify-between font-bold text-base">
            <span>Total</span>
            <span>₦{grandTotal.toLocaleString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}