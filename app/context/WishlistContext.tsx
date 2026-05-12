import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// API disabled — running as frontend only
// import {
//   getWishlist,
//   createWishlist,
//   updateWishlist,
//   deleteWishlist,
// } from "../utils/api";

import { useCart } from "./CartContext";

/* =========================
     TYPES
  ========================= */

export interface WishlistItem {
  id: string | number;
  price?: number;
  salePrice?: number;
  [key: string]: any;
}

interface WishlistContextType {
  wishlist: WishlistItem[];
  addToWishlist: (product: WishlistItem) => void;
  removeFromWishlist: (productId: WishlistItem["id"]) => void;
  isInWishlist: (productId: WishlistItem["id"]) => boolean;
  moveToCart: (product: WishlistItem) => void;
}

/* =========================
     CONTEXT
  ========================= */

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined,
);

/* =========================
     SESSION ID
  ========================= */

const getInitialSessionId = (): string => {
  try {
    const stored = localStorage.getItem("mysticMistSessionId");
    if (stored) return stored;

    const newId = crypto.randomUUID();
    localStorage.setItem("mysticMistSessionId", newId);
    return newId;
  } catch {
    return crypto.randomUUID();
  }
};

/* =========================
     HOOK
  ========================= */

export const useWishlist = (): WishlistContextType => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};

/* =========================
     PROVIDER
  ========================= */

interface Props {
  children: ReactNode;
}

export const WishlistProvider: React.FC<Props> = ({ children }) => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  // const [wishlistId, setWishlistId] = useState<string | number | null>(null);
  // const [sessionId] = useState<string>(getInitialSessionId);

  const { addToCart } = useCart();

  /* =========================
       INIT WISHLIST (API disabled)
    ========================= */

  // useEffect(() => {
  //   const initWishlist = async () => {
  //     try {
  //       const remoteWishlist = await getWishlist(sessionId);
  //
  //       if (remoteWishlist) {
  //         const updatedAt = new Date(remoteWishlist.updatedAt).getTime();
  //         const now = Date.now();
  //         const oneDay = 24 * 60 * 60 * 1000;
  //
  //         if (now - updatedAt > oneDay) {
  //           const idToDelete = remoteWishlist.documentId || remoteWishlist.id;
  //
  //           await deleteWishlist(idToDelete);
  //
  //           setWishlist([]);
  //           setWishlistId(null);
  //           return;
  //         }
  //
  //         setWishlistId(remoteWishlist.documentId || remoteWishlist.id);
  //         setWishlist(remoteWishlist.items || []);
  //       }
  //     } catch (error) {
  //       console.error("Failed to initialize wishlist:", error);
  //     }
  //   };
  //
  //   initWishlist();
  // }, [sessionId]);

  /* =========================
       SYNC WISHLIST (local-only)
    ========================= */

  const syncWishlist = (newItems: WishlistItem[]) => {
    setWishlist(newItems);

    // API sync disabled — running as frontend only
    // if (newItems.length === 0) {
    //   if (wishlistId) {
    //     try {
    //       setWishlistId(null);
    //       await deleteWishlist(wishlistId);
    //     } catch (e) {
    //       console.error("Failed to delete wishlist:", e);
    //     }
    //   }
    //   return;
    // }
    //
    // if (!wishlistId) {
    //   try {
    //     let remoteWishlist = await getWishlist(sessionId);
    //
    //     if (remoteWishlist) {
    //       const id = remoteWishlist.documentId || remoteWishlist.id;
    //       setWishlistId(id);
    //       await updateWishlist(id, newItems);
    //     } else {
    //       remoteWishlist = await createWishlist(sessionId, newItems);
    //       if (remoteWishlist) {
    //         setWishlistId(remoteWishlist.documentId || remoteWishlist.id);
    //       }
    //     }
    //   } catch (e: any) {
    //     console.error("Failed to sync wishlist:", e);
    //
    //     if (e?.message?.includes("unique")) {
    //       try {
    //         const existing = await getWishlist(sessionId);
    //         if (existing) {
    //           const id = existing.documentId || existing.id;
    //           setWishlistId(id);
    //           await updateWishlist(id, newItems);
    //         }
    //       } catch (retryError) {
    //         console.error("Retry failed:", retryError);
    //       }
    //     }
    //   }
    //   return;
    // }
    //
    // try {
    //   await updateWishlist(wishlistId, newItems);
    // } catch (error) {
    //   console.error("Failed to sync wishlist:", error);
    // }
  };

  /* =========================
       ACTIONS
    ========================= */

  const addToWishlist = (product: WishlistItem) => {
    if (isInWishlist(product.id)) return;

    const newWishlist = [...wishlist, product];
    syncWishlist(newWishlist);
  };

  const removeFromWishlist = (productId: WishlistItem["id"]) => {
    const newWishlist = wishlist.filter((item) => item.id !== productId);
    syncWishlist(newWishlist);
  };

  const isInWishlist = (productId: WishlistItem["id"]) => {
    return wishlist.some((item) => item.id === productId);
  };

  const moveToCart = (product: WishlistItem) => {
    addToCart(product as any);
    removeFromWishlist(product.id);
  };

  /* =========================
       PROVIDER VALUE
    ========================= */

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        moveToCart,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
