import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";

import {
  addGuestWishlistAction,
  loadGuestWishlistAction,
  moveGuestWishlistToCartAction,
  removeGuestWishlistAction,
} from "@/app/actions/guest-data";

import { mergeCartLines, type CartProductInput, useCartStore } from "./cartStore";

export interface WishlistItem {
  id: string | number;
  name?: string;
  image?: string;
  price?: number;
  salePrice?: number;
  category?: string;
}

type WishlistStore = {
  wishlist: WishlistItem[];
  rehydrateFromServer: () => Promise<void>;
  addToWishlist: (product: WishlistItem) => void;
  removeFromWishlist: (productId: WishlistItem["id"]) => void;
  isInWishlist: (productId: WishlistItem["id"]) => boolean;
  moveToCart: (product: WishlistItem) => void;
};

export const useWishlistStore = create<WishlistStore>((set, get) => ({
  wishlist: [],

  rehydrateFromServer: async () => {
    try {
      const result = await loadGuestWishlistAction();
      if (result.ok) set({ wishlist: result.items });
    } catch {
      /* ignore */
    }
  },

  addToWishlist: (product) => {
    const prev = get().wishlist;
    if (prev.some((item) => item.id === product.id)) {
      return;
    }
    set({ wishlist: [...prev, product] });

    void (async () => {
      try {
        const result = await addGuestWishlistAction(product.id);
        if (!result.ok) set({ wishlist: prev });
      } catch {
        set({ wishlist: prev });
      }
    })();
  },

  removeFromWishlist: (productId) => {
    const prev = get().wishlist;
    set({ wishlist: prev.filter((item) => item.id !== productId) });

    void (async () => {
      try {
        const result = await removeGuestWishlistAction(productId);
        if (!result.ok) set({ wishlist: prev });
      } catch {
        set({ wishlist: prev });
      }
    })();
  },

  isInWishlist: (productId) =>
    get().wishlist.some((item) => item.id === productId),

  moveToCart: (product) => {
    const price = typeof product.price === "number" ? product.price : 0;
    const line: CartProductInput = {
      ...product,
      id: product.id,
      price,
      salePrice: product.salePrice,
    };

    const wishPrev = get().wishlist;
    const cartPrev = useCartStore.getState().cart;
    const nextCart = mergeCartLines(cartPrev, line, 1);
    const nextWish = wishPrev.filter((item) => item.id !== product.id);

    useCartStore.setState({ cart: nextCart });
    set({ wishlist: nextWish });

    void (async () => {
      try {
        const result = await moveGuestWishlistToCartAction(product.id);
        if (!result.ok) {
          useCartStore.setState({ cart: cartPrev });
          set({ wishlist: wishPrev });
        }
      } catch {
        useCartStore.setState({ cart: cartPrev });
        set({ wishlist: wishPrev });
      }
    })();
  },
}));

export type WishlistContextValue = {
  wishlist: WishlistItem[];
  addToWishlist: WishlistStore["addToWishlist"];
  removeFromWishlist: WishlistStore["removeFromWishlist"];
  isInWishlist: WishlistStore["isInWishlist"];
  moveToCart: WishlistStore["moveToCart"];
};

export function useWishlist(): WishlistContextValue {
  return useWishlistStore(
    useShallow((state) => ({
      wishlist: state.wishlist,
      addToWishlist: state.addToWishlist,
      removeFromWishlist: state.removeFromWishlist,
      isInWishlist: state.isInWishlist,
      moveToCart: state.moveToCart,
    })),
  );
}
