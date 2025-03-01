'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem } from '@/types/checkout';

interface CartStore {
  items: CartItem[];
  total: number;
  addItem: (item: CartItem) => void;
  removeItem: (itemId: number) => void;
  clearCart: () => void;
  calculateTotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,
      addItem: (item) =>
        set((state) => {
          const items = [...state.items, item];
          return {
            items,
            total: get().calculateTotal(),
          };
        }),
      removeItem: (itemId) =>
        set((state) => {
          const items = state.items.filter((item) => item.id !== itemId);
          return {
            items,
            total: get().calculateTotal(),
          };
        }),
      clearCart: () => set({ items: [], total: 0 }),
      calculateTotal: () => {
        const state = get();
        return state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);

export function useCart() {
  const { items, total } = useCartStore();
  return {
    cart: items,
    total,
  };
} 