import React from 'react';
import { Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart, CartItem } from '@/lib/hooks/use-cart';
import { MenuItem as ApiMenuItem } from '@/app/api/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

// Remove local MenuItem interface if it duplicates ApiMenuItem or causes conflict
// interface MenuItem { ... }

interface MenuItemCardProps {
  item: ApiMenuItem; // Use the imported API type
  isGridView?: boolean;
  className?: string;
}

export function MenuItemCard({ item, isGridView = true, className = '' }: MenuItemCardProps) {
  // Destructure correct state/actions
  const { items, addItem, decrementItem } = useCart(); 
  
  // Find the item in the correct items array
  const cartItem = items.find((cartItem: CartItem) => cartItem.id === item.id); // Use CartItem type
  const quantity = cartItem ? cartItem.quantity : 0;

  const handleAddToCart = () => {
    // No need for extra conversion if item prop is already ApiMenuItem
    addItem(item);
  };

  const handleRemoveFromCart = () => {
    decrementItem(item.id); // Use decrementItem
  };

  if (isGridView) {
    return (
      <div className={`bg-white rounded-xl shadow-md overflow-hidden ${className}`}>
        <div className="relative h-40 overflow-hidden">
          <img
            src={item.image_url || `https://placehold.co/400x300/1a1a1a/BF9B30/webp?text=${encodeURIComponent(item.name)}`}
            alt={item.name}
            className="w-full h-full object-cover"
          />
          {!item.is_available && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-white font-semibold px-3 py-1 bg-red-500 rounded-full">
                Out of Stock
              </span>
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 line-clamp-1">{item.name}</h3>
          <p className="text-sm text-gray-500 line-clamp-2 mt-1 h-10">{item.description}</p>
          <div className="mt-3 flex items-center justify-between">
            <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#BF9B30] to-[#DFBD69]">
              ₦{item.price.toLocaleString()}
            </span>
            {item.is_available ? (
              <div className="flex items-center gap-2">
                {quantity > 0 && (
                  <>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={handleRemoveFromCart}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-6 text-center">{quantity}</span>
                  </>
                )}
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 bg-gradient-to-r from-[#BF9B30] to-[#DFBD69] text-white border-0 hover:opacity-90"
                  onClick={handleAddToCart}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button variant="outline" size="sm" disabled>
                Unavailable
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // List view
  return (
    <div className={`bg-white rounded-xl shadow-md overflow-hidden ${className}`}>
      <div className="flex">
        <div className="h-24 w-24 md:h-32 md:w-32 relative flex-shrink-0">
          <img
            src={item.image_url || `https://placehold.co/400x300/1a1a1a/BF9B30/webp?text=${encodeURIComponent(item.name)}`}
            alt={item.name}
            className="w-full h-full object-cover"
          />
          {!item.is_available && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-white text-xs font-semibold px-2 py-0.5 bg-red-500 rounded-full">
                Out of Stock
              </span>
            </div>
          )}
        </div>
        <div className="flex-1 p-4 flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">{item.name}</h3>
            <p className="text-sm text-gray-500 line-clamp-1 mt-1">{item.description}</p>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#BF9B30] to-[#DFBD69]">
              ₦{item.price.toLocaleString()}
            </span>
            {item.is_available ? (
              <div className="flex items-center gap-2">
                {quantity > 0 && (
                  <>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={handleRemoveFromCart}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-6 text-center">{quantity}</span>
                  </>
                )}
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 bg-gradient-to-r from-[#BF9B30] to-[#DFBD69] text-white border-0 hover:opacity-90"
                  onClick={handleAddToCart}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button variant="outline" size="sm" disabled>
                Unavailable
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}