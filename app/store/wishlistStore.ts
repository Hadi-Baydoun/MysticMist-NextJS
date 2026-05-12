import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";

import type { CartItem } from "./cartStore";
import { useCartStore } from "./cartStore";

export interface WishlistItem {
  id: string | number;
  price?: number;
  salePrice?: number;
  [key: string]: any;
}

type WishlistStore = {
  wishlist: WishlistItem[];
  addToWishlist: (product: WishlistItem) => void;
  removeFromWishlist: (productId: WishlistItem["id"]) => void;
  isInWishlist: (productId: WishlistItem["id"]) => boolean;
  moveToCart: (product: WishlistItem) => void;
};

export const useWishlistStore = create<WishlistStore>((set, get) => ({
  wishlist: [],

  addToWishlist: (product) => {
    set((state) => {
      if (state.wishlist.some((item) => item.id === product.id)) {
        return state;
      }
      return { wishlist: [...state.wishlist, product] };
    });
  },

  removeFromWishlist: (productId) => {
    set((state) => ({
      wishlist: state.wishlist.filter((item) => item.id !== productId),
    }));
  },

  isInWishlist: (productId) =>
    get().wishlist.some((item) => item.id === productId),

  moveToCart: (product) => {
    useCartStore.getState().addToCart(product as CartItem, 1);
    set((state) => ({
      wishlist: state.wishlist.filter((item) => item.id !== product.id),
    }));
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
