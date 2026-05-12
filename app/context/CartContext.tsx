import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// API disabled — running as frontend only
// import {
//   getCart,
//   createCart,
//   updateCart as updateCartApi,
//   deleteCart,
// } from "../utils/api";

/* =========================
     TYPES
  ========================= */

export interface CartItem {
  id: string | number;
  price: number;
  salePrice?: number;
  quantity: number;
  [key: string]: any; // allow extra product fields
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: CartItem, quantity?: number) => void;
  removeFromCart: (productId: CartItem["id"]) => void;
  updateQuantity: (productId: CartItem["id"], newQuantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
}

/* =========================
     CONTEXT
  ========================= */

const CartContext = createContext<CartContextType | undefined>(undefined);

/* =========================
     HELPERS
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

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

/* =========================
     PROVIDER
  ========================= */

interface Props {
  children: ReactNode;
}

export const CartProvider: React.FC<Props> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  // const [cartId, setCartId] = useState<string | number | null>(null);
  // const [sessionId, setSessionId] = useState<string>(getInitialSessionId);

  /* =========================
       INIT CART (API disabled)
    ========================= */

  // useEffect(() => {
  //   const initCart = async () => {
  //     try {
  //       const remoteCart = await getCart(sessionId);
  //
  //       if (remoteCart) {
  //         const updatedAt = new Date(remoteCart.updatedAt).getTime();
  //         const now = Date.now();
  //         const oneDay = 24 * 60 * 60 * 1000;
  //
  //         if (now - updatedAt > oneDay) {
  //           const idToDelete = remoteCart.documentId || remoteCart.id;
  //
  //           await deleteCart(idToDelete);
  //
  //           localStorage.removeItem("mysticMistSessionId");
  //
  //           const newId = crypto.randomUUID();
  //           localStorage.setItem("mysticMistSessionId", newId);
  //
  //           setSessionId(newId);
  //           setCart([]);
  //           setCartId(null);
  //           return;
  //         }
  //
  //         setCartId(remoteCart.documentId || remoteCart.id);
  //         setCart(remoteCart.items || []);
  //       } else {
  //         console.log("No cart found for session:", sessionId);
  //       }
  //     } catch (error) {
  //       console.error("Failed to initialize cart:", error);
  //     }
  //   };
  //
  //   initCart();
  // }, [sessionId]);

  /* =========================
       SYNC CART (local-only)
    ========================= */

  const syncCart = (newCartItems: CartItem[]) => {
    setCart(newCartItems);

    // API sync disabled — running as frontend only
    // if (newCartItems.length === 0) {
    //   if (cartId) {
    //     try {
    //       setCartId(null);
    //       await deleteCart(cartId);
    //     } catch (e) {
    //       console.error("Failed to delete empty cart:", e);
    //     }
    //   }
    //   return;
    // }
    //
    // if (!cartId) {
    //   try {
    //     let remoteCart = await getCart(sessionId);
    //
    //     if (remoteCart) {
    //       const id = remoteCart.documentId || remoteCart.id;
    //       setCartId(id);
    //       await updateCartApi(id, newCartItems);
    //     } else {
    //       remoteCart = await createCart(sessionId, newCartItems);
    //       if (remoteCart) {
    //         setCartId(remoteCart.documentId || remoteCart.id);
    //       }
    //     }
    //   } catch (e: any) {
    //     console.error("Cart sync failed:", e);
    //
    //     if (e?.message?.includes("unique")) {
    //       try {
    //         const existing = await getCart(sessionId);
    //         if (existing) {
    //           const id = existing.documentId || existing.id;
    //           setCartId(id);
    //           await updateCartApi(id, newCartItems);
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
    //   await updateCartApi(cartId, newCartItems);
    // } catch (error) {
    //   console.error("Failed to sync cart:", error);
    //
    //   try {
    //     const remoteCart = await createCart(sessionId, newCartItems);
    //     if (remoteCart) {
    //       setCartId(remoteCart.documentId || remoteCart.id);
    //     }
    //   } catch (createError) {
    //     console.error("Re-create failed:", createError);
    //   }
    // }
  };

  /* =========================
       ACTIONS
    ========================= */

  const addToCart = (product: CartItem, quantity = 1) => {
    const prev = [...cart];

    const index = prev.findIndex((item) => item.id === product.id);

    let newCart: CartItem[];

    if (index >= 0) {
      newCart = [...prev];
      newCart[index].quantity += quantity;
    } else {
      newCart = [...prev, { ...product, quantity }];
    }

    syncCart(newCart);
  };

  const removeFromCart = (productId: CartItem["id"]) => {
    const newCart = cart.filter((item) => item.id !== productId);
    syncCart(newCart);
  };

  const updateQuantity = (productId: CartItem["id"], newQuantity: number) => {
    if (newQuantity < 1) return;

    const newCart = cart.map((item) =>
      item.id === productId ? { ...item, quantity: newQuantity } : item,
    );

    syncCart(newCart);
  };

  const clearCart = () => {
    syncCart([]);
  };

  /* =========================
       DERIVED VALUES
    ========================= */

  const cartTotal = cart.reduce((total, item) => {
    const price =
      item.salePrice && item.salePrice > 0 ? item.salePrice : item.price;

    return total + price * item.quantity;
  }, 0);

  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  /* =========================
       PROVIDER VALUE
    ========================= */

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
