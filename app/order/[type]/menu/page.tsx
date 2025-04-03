"use client";

import React, { useState, useCallback, useTransition, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Search, Grid, List } from "lucide-react";
import debounce from 'lodash/debounce';
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { MenuItemCard } from "@/components/menu/menu-item-card";
import { CategoryCard } from "@/components/menu/category-card";
import { Category, MenuItem } from "@/app/api/types";
import { CartDrawer } from "@/components/menu/cart-drawer";
import { Breadcrumb } from "@/components/menu/breadcrumb";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import axios from "axios";
import { useCart } from '@/lib/hooks/use-cart';

interface MenuResponse {
  menuItems: MenuItem[];
  pagination: {
    total: number;
    page: number;
    totalPages: number;
  };
}

// API client functions
const api = axios.create({
  baseURL: '/api',
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache'
  }
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log('Making request:', {
      method: config.method,
      url: config.url,
      headers: config.headers
    });
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('Response received:', {
      status: response.status,
      headers: response.headers,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('Response error:', {
      message: error.message,
      response: error.response ? {
        status: error.response.status,
        data: error.response.data
      } : null
    });
    return Promise.reject(error);
  }
);

const fetchCategories = async (): Promise<Category[]> => {
  try {
    console.log('Fetching categories from API...');
    const response = await api.get<{ categories: Category[]; count: number; message: string }>('/categories');
    
    console.log('Categories API response:', response.data);

    if (!response.data?.categories || !Array.isArray(response.data.categories)) {
      console.error('Invalid response format:', response.data);
      return [];
    }

    // Map and validate each category
    const validCategories = response.data.categories.map(category => ({
      id: category.id || '',
      name: category.name || 'Unnamed Category',
      description: category.description || '',
      image_url: category.image_url || `https://placehold.co/300x300/1a1a1a/BF9B30/webp?text=${encodeURIComponent(category.name || 'Category')}`
    }));

    console.log(`Successfully fetched ${validCategories.length} categories:`, validCategories);
    return validCategories;
  } catch (error) {
    console.error('Error in fetchCategories:', error);
    return []; // Return empty array instead of throwing error
  }
};

const fetchMenuItems = async ({ 
  categoryId, 
  page = 1,
  search = '',
  popular = false 
}: { 
  categoryId?: string;
  page?: number;
  search?: string;
  popular?: boolean;
}): Promise<MenuResponse> => {
  const { data } = await api.get('/menu', {
    params: {
      category_id: categoryId,
      page,
      search,
      popular
    }
  });
  return data;
};

export default function MenuPage() {
  const params = useParams();
  const orderType = params.type as string;
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [isGridView, setIsGridView] = useState(true);
  const [allItems, setAllItems] = useState<MenuItem[]>([]);
  
  // Use the cart from the correct hook
  const { items: cartItems, addItem, getTotal } = useCart(); // Destructure needed state/actions

  // Fetch categories
  const { data: categories = [], isLoading: categoriesLoading, error: categoriesError } = useQuery<Category[], Error>({    
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)
  });

  // Log when categories are loaded successfully
  useEffect(() => {
    if (categories && categories.length > 0) {
      console.log('Categories loaded successfully:', {
        count: categories.length,
        sample: categories.slice(0, 2)
      });
    }
  }, [categories]);

  // Fetch menu items
  const { 
    data: menuData, 
    isLoading: menuItemsLoading,
    error: menuItemsError
  } = useQuery<MenuResponse>({
    queryKey: ['menuItems', selectedCategory, currentPage, searchQuery],
    queryFn: () => fetchMenuItems({
      categoryId: selectedCategory || undefined,
      page: currentPage,
      search: searchQuery
    }),
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
  });

  // Fetch popular items
  const { 
    data: popularItemsData,
    isLoading: popularItemsLoading,
    error: popularItemsError
  } = useQuery<MenuResponse>({
    queryKey: ['popularItems'],
    queryFn: () => fetchMenuItems({ popular: true }),
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
  });

  // Update allItems when menu items change
  useEffect(() => {
    if (menuData?.menuItems) {
      setAllItems(prevItems => {
        const newItems = [...prevItems];
        const seenIds = new Set(newItems.map(item => item.id));
        
        menuData.menuItems.forEach(item => {
          if (!seenIds.has(item.id)) {
            newItems.push(item);
            seenIds.add(item.id);
          }
        });
        
        return newItems;
      });
    }
  }, [menuData?.menuItems]);

  // Update allItems when popular items change
  useEffect(() => {
    if (popularItemsData?.menuItems) {
      setAllItems(prevItems => {
        const newItems = [...prevItems];
        const seenIds = new Set(newItems.map(item => item.id));
        
        popularItemsData.menuItems.forEach(item => {
          if (!seenIds.has(item.id)) {
            newItems.push(item);
            seenIds.add(item.id);
          }
        });
        
        return newItems;
      });
    }
  }, [popularItemsData?.menuItems]);

  // Debounced search handler
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      startTransition(() => {
        setSearchQuery(value);
        setCurrentPage(1); // Reset to first page on new search
      });
    }, 300),
    []
  );

  const handleCategorySelect = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1); // Reset to first page on category change
    setSearchQuery(""); // Clear search on category change
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Check if cart has items based on the items array
  const hasItems = cartItems.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
      <div className="container mx-auto px-4 py-8 relative">
        <Breadcrumb 
          orderType={orderType} 
          category={categories.find((c: Category) => c.id === selectedCategory)?.name}
        />
        
        {/* Search and View Toggle */}
        <div className="flex items-center justify-between mb-8 bg-white rounded-xl p-3 shadow-lg">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search menu items..."
              className="pl-10 w-full border-none focus:ring-2 focus:ring-primary/20 rounded-lg"
              onChange={(e) => debouncedSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 ml-4">
            <button
              onClick={() => setIsGridView(true)}
              className={`p-2 rounded-lg transition-all duration-200 ${
                isGridView 
                ? 'bg-gradient-to-r from-[#BF9B30] to-[#DFBD69] text-white shadow-md' 
                : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <Grid size={20} />
            </button>
            <button
              onClick={() => setIsGridView(false)}
              className={`p-2 rounded-lg transition-all duration-200 ${
                !isGridView 
                ? 'bg-gradient-to-r from-[#BF9B30] to-[#DFBD69] text-white shadow-md' 
                : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <List size={20} />
            </button>
          </div>
        </div>

        {/* Categories Horizontal Scroll */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Categories</h2>
          {categoriesError ? (
            <div className="text-red-500">Error loading categories: {categoriesError.message}</div>
          ) : categoriesLoading ? (
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="h-32 w-32 flex-shrink-0 rounded-xl bg-gray-200" />
              ))}
            </div>
          ) : (
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              <CategoryCard
                key="all"
                category={{ 
                  id: '', 
                  name: "All Items", 
                  image_url: "https://placehold.co/300x300/1a1a1a/BF9B30/webp?text=All%20Items",
                  description: "View all menu items" 
                }}
                isSelected={selectedCategory === null}
                onClick={() => handleCategorySelect(null)}
                className="w-32 flex-shrink-0 transform transition-all duration-200 hover:scale-105"
                priority={true}
              />
              {(categories || []).map((category: Category, index: number) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  isSelected={selectedCategory === category.id}
                  onClick={() => handleCategorySelect(category.id)}
                  className="w-32 flex-shrink-0 transform transition-all duration-200 hover:scale-105"
                  priority={index === 0}
                />
              ))}
            </div>
          )}
        </div>

        {/* Popular Items */}
        {!selectedCategory && !searchQuery && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#BF9B30] to-[#DFBD69]">
                Popular Items
              </span>
            </h2>
            {popularItemsError ? (
              <div className="text-red-500">Error loading popular items: {popularItemsError.message}</div>
            ) : popularItemsLoading ? (
              <div className={`grid ${isGridView ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'} gap-3 md:gap-6`}>
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-40 rounded-xl bg-gray-200" />
                ))}
              </div>
            ) : popularItemsData?.menuItems ? (
              <div className={`grid ${isGridView ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'} gap-3 md:gap-6`}>
                {popularItemsData.menuItems.map((item) => (
                  <MenuItemCard
                    key={item.id}
                    item={{ ...item, is_available: true }}
                    isGridView={isGridView}
                    className="transform transition-all duration-200 hover:scale-[1.02] hover:shadow-xl"
                  />
                ))}
              </div>
            ) : null}
          </div>
        )}

        {/* Menu Items */}
        <div>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            {searchQuery
              ? `Search Results for "${searchQuery}"`
              : selectedCategory
              ? `${categories.find((c: Category) => c.id === selectedCategory)?.name || ''} Menu`
              : "All Items"}
          </h2>
          {menuItemsError ? (
            <div className="text-red-500">Error loading menu items: {menuItemsError.message}</div>
          ) : menuItemsLoading ? (
            <div className={`grid ${isGridView ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'} gap-3 md:gap-6`}>
              {[...Array(9)].map((_, i) => (
                <Skeleton key={i} className="h-40 rounded-xl bg-gray-200" />
              ))}
            </div>
          ) : menuData?.menuItems ? (
            <>
              <div className={`grid ${isGridView ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'} gap-3 md:gap-6`}>
                {menuData.menuItems.map((item) => (
                  <MenuItemCard
                    key={item.id}
                    item={{ ...item, is_available: true }}
                    isGridView={isGridView}
                    className="transform transition-all duration-200 hover:scale-[1.02] hover:shadow-xl"
                  />
                ))}
              </div>
              
              {/* Pagination */}
              {menuData.pagination?.totalPages > 1 && (
                <div className="mt-8 flex justify-center gap-2">
                  {[...Array(menuData.pagination.totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => handlePageChange(i + 1)}
                      className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                        currentPage === i + 1
                          ? "bg-gradient-to-r from-[#BF9B30] to-[#DFBD69] text-white shadow-md"
                          : "bg-white hover:bg-gray-50 border border-gray-200"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : null}
        </div>

        {/* Cart Summary - Uses the CartDrawer component directly */}
        {hasItems && <CartDrawer />}
      </div> 
    </div>
  );
}