import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Minus } from 'lucide-react';
import { MenuItem } from '@/app/api/types';
import { CloudinaryImage } from '@/components/ui/cloudinary-image';

export interface MenuItemCardProps {
  item: MenuItem;
  quantity: number;
  onAdd: (id: string) => void;
  onRemove: (id: string) => void;
  isGridView?: boolean;
  className?: string;
}

export function MenuItemCard({ item, quantity, onAdd, onRemove, isGridView = true, className = "" }: MenuItemCardProps) {
  const [imageError, setImageError] = useState(false);
  
  // Generate a placeholder URL with the item name
  const placeholderUrl = `https://placehold.co/400x300/1a1a1a/BF9B30/webp?text=${encodeURIComponent(item.name)}`;

  // Use Cloudinary image if available and hasn't errored, otherwise use placeholder
  const imageUrl = !imageError && item.image_url ? item.image_url : placeholderUrl;

  return (
    <div className={`bg-white rounded-lg shadow-sm overflow-hidden ${isGridView ? 'flex flex-col' : 'flex'} ${className}`}>
      <div className={`relative ${isGridView ? 'h-40' : 'h-24 w-24'}`}>
        <CloudinaryImage
          src={imageUrl}
          alt={item.name}
          width={400}
          height={300}
          className="object-cover h-full w-full"
          onError={() => {
            console.error('Failed to load image:', imageUrl);
            setImageError(true);
          }}
        />
      </div>
      <div className={`p-4 flex flex-col justify-between ${isGridView ? '' : 'flex-1'}`}>
        <div>
          <h3 className="font-semibold text-gray-900">{item.name}</h3>
          {item.description && (
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{item.description}</p>
          )}
        </div>
        <div className={`mt-4 flex ${isGridView ? 'flex-col gap-2' : 'items-center justify-between'}`}>
          <p className="text-primary font-semibold">₦{item.price.toLocaleString()}</p>
          <div className="flex items-center gap-2">
            {quantity > 0 && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onRemove(item.id)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center">{quantity}</span>
              </>
            )}
            <Button
              variant="default"
              size="icon"
              className="h-8 w-8"
              onClick={() => onAdd(item.id)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 