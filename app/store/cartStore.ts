import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";

export interface CartItem {
  id: string | number;
  price: number;
  salePrice?: number;
  quantity: number;
  [key: string]: any;
}

function computeCartTotal(cart: CartItem[]): number {
  return cart.reduce((total, item) => {
    const price =
      item.salePrice != null && item.salePrice > 0 ? item.salePrice : item.price;
    return total + price * item.quantity;
  }, 0);
}

function computeCartCount(cart: CartItem[]): number {
  return cart.reduce((count, item) => count + item.quantity, 0);
}

type CartStore = {
  cart: CartItem[];
  addToCart: (product: CartItem, quantity?: number) => void;
  removeFromCart: (productId: CartItem["id"]) => void;
  updateQuantity: (productId: CartItem["id"], newQuantity: number) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartStore>((set, get) => ({
  cart: [],

  addToCart: (product, quantity = 1) => {
    const prev = [...get().cart];
    const index = prev.findIndex((item) => item.id === product.id);

    let newCart: CartItem[];

    if (index >= 0) {
      newCart = [...prev];
      newCart[index] = {
        ...newCart[index],
        quantity: newCart[index].quantity + quantity,
      };
    } else {
      newCart = [...prev, { ...product, quantity }];
    }

    set({ cart: newCart });
  },

  removeFromCart: (productId) => {
    set({ cart: get().cart.filter((item) => item.id !== productId) });
  },

  updateQuantity: (productId, newQuantity) => {
    if (newQuantity < 1) return;

    set({
      cart: get().cart.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item,
      ),
    });
  },

  clearCart: () => set({ cart: [] }),
}));

export type CartContextValue = {
  cart: CartItem[];
  addToCart: CartStore["addToCart"];
  removeFromCart: CartStore["removeFromCart"];
  updateQuantity: CartStore["updateQuantity"];
  clearCart: CartStore["clearCart"];
  cartTotal: number;
  cartCount: number;
};

export function useCart(): CartContextValue {
  return useCartStore(
    useShallow((state) => ({
      cart: state.cart,
      addToCart: state.addToCart,
      removeFromCart: state.removeFromCart,
      updateQuantity: state.updateQuantity,
      clearCart: state.clearCart,
      cartTotal: computeCartTotal(state.cart),
      cartCount: computeCartCount(state.cart),
    })),
  );
}
