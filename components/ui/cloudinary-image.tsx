import Image from 'next/image';
import { useState } from 'react';

interface CloudinaryImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  onError?: () => void;
  priority?: boolean;
}

export function CloudinaryImage({ src, alt, width, height, className, onError, priority = false }: CloudinaryImageProps) {
  const [imgError, setImgError] = useState(false);

  // Function to get a descriptive placeholder based on the alt text or src
  const getDescriptivePlaceholder = () => {
    const text = alt || src?.split('/').pop()?.split('.')[0] || 'Image';
    // Clean up the text for the placeholder
    const cleanText = text
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
    
    return `https://placehold.co/${width}x${height}/1a1a1a/BF9B30/webp?text=${encodeURIComponent(cleanText)}`;
  };

  // If image has already errored or no src provided, use descriptive placeholder
  if (imgError || !src) {
    return (
      <Image
        src={getDescriptivePlaceholder()}
        alt={alt}
        width={width}
        height={height}
        className={className}
        priority={priority}
        unoptimized // Skip optimization for placeholder service
      />
    );
  }

  // Handle non-Cloudinary URLs
  if (!src.includes('cloudinary')) {
    return (
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        loading={priority ? 'eager' : 'lazy'}
        quality={90}
        priority={priority}
        onError={() => {
          setImgError(true);
          onError?.();
        }}
      />
    );
  }

  // Parse and optimize Cloudinary URL
  try {
    const url = new URL(src);
    const pathParts = url.pathname.split('/');
    const uploadIndex = pathParts.indexOf('upload');
    
    if (uploadIndex === -1) {
      throw new Error('Invalid Cloudinary URL format');
    }

    // Extract path after 'upload'
    const imagePath = pathParts.slice(uploadIndex + 1).join('/');
    
    // Clean up version prefix if present
    const cleanImagePath = imagePath.replace(/^v\d+\//, '');
    
    // Add format conversion for HEIC images
    const format = cleanImagePath.toLowerCase().endsWith('.heic') ? ',f_jpg' : '';
    
    // Get cloud name from URL
    const cloudName = url.host.split('.')[0].replace('res', 'djx3im1eb');
    
    // Construct optimized URL with minimal transformations
    const optimizedUrl = `https://res.cloudinary.com/${cloudName}/image/upload/c_fill,w_${width},h_${height}${format}/${cleanImagePath}`;

    return (
      <Image
        src={optimizedUrl}
        alt={alt}
        width={width}
        height={height}
        className={className}
        loading={priority ? 'eager' : 'lazy'}
        quality={90}
        priority={priority}
        onError={() => {
          setImgError(true);
          onError?.();
        }}
      />
    );
  } catch (error) {
    console.error('Error parsing Cloudinary URL:', error);
    // Fallback to descriptive placeholder on error
    return (
      <Image
        src={getDescriptivePlaceholder()}
        alt={alt}
        width={width}
        height={height}
        className={className}
        priority={priority}
        unoptimized // Skip optimization for placeholder service
      />
    );
  }
}