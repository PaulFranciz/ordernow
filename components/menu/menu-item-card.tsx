import React from 'react';
import { Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';
import { MenuItem as ApiMenuItem } from '@/app/api/types';

// Use a local interface that matches what we're actually using
interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  image: string; // Add this to match the API type
  is_available: boolean;
  category_id: string;
}

interface MenuItemCardProps {
  item: MenuItem;
  isGridView?: boolean;
  className?: string;
}

export function MenuItemCard({ item, isGridView = true, className = '' }: MenuItemCardProps) {
  const { cart, addItem, removeItem } = useCart();
  
  // Find the item in the cart to get its quantity
  const cartItem = cart.find(cartItem => cartItem.id === item.id);
  const quantity = cartItem ? cartItem.quantity : 0;

  const handleAddToCart = () => {
    // Ensure the item has all required properties before adding to cart
    const menuItem: ApiMenuItem = {
      ...item,
      image: item.image || item.image_url || '', // Ensure image is set
    };
    addItem(menuItem);
  };

  const handleRemoveFromCart = () => {
    removeItem(item.id);
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