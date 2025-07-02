import { create } from "zustand";

export interface CartItem {
  id: number;
  name: string;
  price: string;
  image: string;
}

interface CartState {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  cart: [],
  addToCart: (item) =>
    set((state) => ({
      cart: [...state.cart, item],
    })),
  clearCart: () => set({ cart: [] }),
}));
