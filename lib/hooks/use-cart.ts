import { create } from 'zustand';
import { toast } from 'react-hot-toast';
import { persist } from 'zustand/middleware';
import { MenuItem } from '@/app/api/types';

// Define CartItem based on MenuItem but add quantity
// Export CartItem as well
export interface CartItem extends Omit<MenuItem, 'image' | 'category_id'> {
  quantity: number;
}

// Export the interface with the correct name
export interface CartStore {
  items: CartItem[];
  addItem: (item: MenuItem) => void;
  removeItem: (itemId: string) => void;
  decrementItem: (itemId: string) => void;
  clearCart: () => void;
  getTotal: () => number;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (itemToAdd) => {
        set((state) => {
          const existingItem = state.items.find((i) => i.id === itemToAdd.id);
          let newItems;
          if (existingItem) {
            newItems = state.items.map((i) =>
              i.id === itemToAdd.id ? { ...i, quantity: i.quantity + 1 } : i
            );
          } else {
            const { image, category_id, ...rest } = itemToAdd;
            const newCartItem: CartItem = { ...rest, quantity: 1 };
            newItems = [...state.items, newCartItem];
          }
          return { items: newItems };
        });
      },
      removeItem: (itemId) => {
        set((state) => ({
          items: state.items.filter((i) => i.id !== itemId),
        }));
      },
      decrementItem: (itemId) => {
        set((state) => {
          const existingItem = state.items.find((i) => i.id === itemId);
          if (existingItem && existingItem.quantity > 1) {
            return {
              items: state.items.map((i) =>
                i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i
              ),
            };
          } else {
            return { items: state.items.filter((i) => i.id !== itemId) };
          }
        });
      },
      clearCart: () => set({ items: [] }),
      getTotal: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage',
      // partialize: (state) => ({ items: state.items }),
    }
  )
);

// Helper hook to get total directly (optional, but convenient)
export const useCartTotal = () => useCart((state) => state.getTotal());
