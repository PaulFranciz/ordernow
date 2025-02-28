import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import Link from 'next/link';

interface BreadcrumbProps {
  orderType: string;
  category?: string;
}

export function Breadcrumb({ orderType, category }: BreadcrumbProps) {
  return (
    <nav className="flex items-center space-x-2 text-sm mb-6">
      <Link 
        href="/"
        className="flex items-center text-gray-500 hover:text-gray-700 transition-colors"
      >
        <Home className="h-4 w-4" />
      </Link>
      <ChevronRight className="h-4 w-4 text-gray-400" />
      <Link 
        href={`/order/${orderType}`}
        className="text-gray-500 hover:text-gray-700 transition-colors capitalize"
      >
        {orderType.replace('-', ' ')}
      </Link>
      <ChevronRight className="h-4 w-4 text-gray-400" />
      <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#BF9B30] to-[#DFBD69] font-medium">
        {category || 'Menu'}
      </span>
    </nav>
  );
} 