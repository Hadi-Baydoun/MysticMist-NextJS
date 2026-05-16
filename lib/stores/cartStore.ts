import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";

import {
  addToGuestCartAction,
  clearGuestCartAction,
  loadGuestCartAction,
  removeGuestCartLineAction,
  updateGuestCartQuantityAction,
} from "@/app/actions/guest-data";

export interface CartItem {
  id: string | number;
  price: number;
  salePrice?: number;
  quantity: number;
  [key: string]: any;
}

/** Payload for add-to-cart (quantity is passed separately). */
export type CartProductInput = Omit<CartItem, "quantity">;

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

/** Merge an added line into cart lines (pure). */
export function mergeCartLines(
  cart: CartItem[],
  product: CartProductInput,
  quantity: number,
): CartItem[] {
  const index = cart.findIndex((item) => item.id === product.id);
  if (index >= 0) {
    const next = [...cart];
    next[index] = {
      ...next[index],
      quantity: next[index].quantity + quantity,
    };
    return next;
  }
  return [...cart, { ...product, quantity } as CartItem];
}

type CartStore = {
  cart: CartItem[];
  rehydrateFromServer: () => Promise<void>;
  setCart: (cart: CartItem[]) => void;
  addToCart: (product: CartProductInput, quantity?: number) => void;
  removeFromCart: (productId: CartItem["id"]) => void;
  updateQuantity: (productId: CartItem["id"], newQuantity: number) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartStore>((set, get) => ({
  cart: [],

  rehydrateFromServer: async () => {
    try {
      const result = await loadGuestCartAction();
      if (result.ok) set({ cart: result.items });
    } catch {
      /* ignore */
    }
  },

  setCart: (cart) => set({ cart }),

  addToCart: (product, quantity = 1) => {
    const prev = get().cart;
    const nextCart = mergeCartLines(prev, product, quantity);
    set({ cart: nextCart });

    void (async () => {
      try {
        const result = await addToGuestCartAction(product.id, quantity);
        if (!result.ok) set({ cart: prev });
      } catch {
        set({ cart: prev });
      }
    })();
  },

  removeFromCart: (productId) => {
    const prev = get().cart;
    set({ cart: prev.filter((item) => item.id !== productId) });

    void (async () => {
      try {
        const result = await removeGuestCartLineAction(productId);
        if (!result.ok) set({ cart: prev });
      } catch {
        set({ cart: prev });
      }
    })();
  },

  updateQuantity: (productId, newQuantity) => {
    if (newQuantity < 1) return;

    const prev = get().cart;
    set({
      cart: prev.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item,
      ),
    });

    void (async () => {
      try {
        const result = await updateGuestCartQuantityAction(
          productId,
          newQuantity,
        );
        if (!result.ok) set({ cart: prev });
      } catch {
        set({ cart: prev });
      }
    })();
  },

  clearCart: () => {
    const prev = get().cart;
    set({ cart: [] });

    void (async () => {
      try {
        const result = await clearGuestCartAction();
        if (!result.ok) set({ cart: prev });
      } catch {
        set({ cart: prev });
      }
    })();
  },
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
