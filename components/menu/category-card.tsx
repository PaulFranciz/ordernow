import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Category } from '@/app/api/types';
import { CloudinaryImage } from '@/components/ui/cloudinary-image';

interface CategoryCardProps {
  category: Category;
  isSelected: boolean;
  onClick: () => void;
  className?: string;
  priority?: boolean;
  index?: number;
}

export function CategoryCard({ category, isSelected, onClick, className = '', priority = false, index = 0 }: CategoryCardProps) {
  const [imageError, setImageError] = useState(false);
  const shouldPrioritize = priority || index < 4;
  
  // Generate a placeholder URL with the category name as fallback
  const placeholderUrl = `https://placehold.co/300x300/1a1a1a/BF9B30/webp?text=${encodeURIComponent(category.name)}`;

  // Use Cloudinary image if available and hasn't errored, otherwise use placeholder
  const imageUrl = !imageError && category.image_url ? category.image_url : placeholderUrl;

  useEffect(() => {
    console.log('Category:', category.name);
    console.log('Image URL:', category.image_url);
    console.log('Using URL:', imageUrl);
  }, [category, imageUrl]);

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full"
      >
        <Card
          className={`
            relative overflow-hidden cursor-pointer aspect-square
            ${isSelected 
              ? 'ring-2 ring-primary border-primary' 
              : 'hover:border-primary'
            }
            transition-all duration-200
          `}
          onClick={onClick}
        >
          {/* Background Image */}
          <div className="relative w-full h-full">
            <CloudinaryImage
              src={imageUrl}
              alt={category.name}
              width={400}
              height={400}
              className="object-cover w-full h-full"
              priority={shouldPrioritize}
              onError={() => {
                console.error('Failed to load image:', imageUrl);
                setImageError(true);
              }}
            />
          </div>
        </Card>
      </motion.div>
      
      {/* Category Name Below Card */}
      <div className="text-center">
        <h3 className="text-base font-semibold text-gray-900">
          {category.name}
        </h3>
        {category.description && (
          <p className="text-xs text-gray-500 mt-1 line-clamp-2">
            {category.description}
          </p>
        )}
      </div>
    </div>
  );
} 