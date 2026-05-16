"use client";

import { useEffect } from "react";

import { loadGuestCartAndWishlistAction } from "@/app/actions/guest-data";
import { useCartStore } from "@/lib/stores/cartStore";
import { useWishlistStore } from "@/lib/stores/wishlistStore";

/** Hydrates guest cart + wishlist in one Server Action so the session cookie is set once. */
export function GuestCartWishlistSync() {
  useEffect(() => {
    void (async () => {
      try {
        const result = await loadGuestCartAndWishlistAction();
        if (!result.ok) return;
        useCartStore.setState({ cart: result.cart });
        useWishlistStore.setState({ wishlist: result.wishlist });
      } catch {
        /* ignore */
      }
    })();
  }, []);

  return null;
}
