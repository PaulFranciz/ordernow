import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Define the cart item type
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  description?: string;
  image_url?: string;
}

interface CartStore {
  cart: CartItem[];
  total: number;
  addItem: (item: MenuItem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  calculateTotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: [],
      total: 0,
      addItem: (item) =>
        set((state) => {
          // Check if item already exists in cart
          const existingItemIndex = state.cart.findIndex(
            (cartItem) => cartItem.id === item.id
          );

          let items;
          if (existingItemIndex >= 0) {
            // Update quantity if item exists
            items = [...state.cart];
            items[existingItemIndex] = {
              ...items[existingItemIndex],
              quantity: items[existingItemIndex].quantity + 1
            };
          } else {
            // Add new item if it doesn't exist
            items = [...state.cart, {
              id: item.id,
              name: item.name || 'Unknown Item',
              price: item.price || 0,
              quantity: 1,
              description: item.description,
              image_url: item.image_url
            }];
          }
          
          const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
          
          return {
            cart: items,
            total,
          };
        }),
      removeItem: (itemId) =>
        set((state) => {
          const existingItemIndex = state.cart.findIndex(
            (cartItem) => cartItem.id === itemId
          );

          if (existingItemIndex >= 0) {
            let items;
            
            // If quantity is 1, remove the item
            if (state.cart[existingItemIndex].quantity === 1) {
              items = state.cart.filter((item) => item.id !== itemId);
            } else {
              // Otherwise decrease quantity
              items = [...state.cart];
              items[existingItemIndex] = {
                ...items[existingItemIndex],
                quantity: items[existingItemIndex].quantity - 1
              };
            }

            const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

            return {
              cart: items,
              total,
            };
          }
          
          return state;
        }),
      updateQuantity: (itemId, quantity) => 
        set((state) => {
          const existingItemIndex = state.cart.findIndex(
            (cartItem) => cartItem.id === itemId
          );

          if (existingItemIndex >= 0) {
            let items;
            
            if (quantity <= 0) {
              // Remove item if quantity is 0 or less
              items = state.cart.filter((item) => item.id !== itemId);
            } else {
              // Update quantity
              items = [...state.cart];
              items[existingItemIndex] = {
                ...items[existingItemIndex],
                quantity
              };
            }

            const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

            return {
              cart: items,
              total,
            };
          }
          
          return state;
        }),
      clearCart: () => set({ cart: [], total: 0 }),
      calculateTotal: () => {
        const state = get();
        return state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);

// Simplified hook to use in components
export function useCart() {
  const { 
    cart, 
    total, 
    addItem, 
    removeItem, 
    updateQuantity, 
    clearCart,
  } = useCartStore();
  
  // Convert items array to the cart object format used in CartDrawer
  const cartMap = cart.reduce((map, item) => {
    map[item.id] = item.quantity;
    return map;
  }, {} as { [key: string]: number });
  
  return {
    cart,
    cartMap,
    total,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  };
}