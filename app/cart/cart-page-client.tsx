"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, Sparkles, Trash2 } from "lucide-react";

import { useCart, type CartItem } from "@/lib/stores/cartStore";

const PLACEHOLDER =
  "https://placehold.co/600x800/e8d4ef/a156b4?text=Product";

function unitPrice(item: CartItem): number {
  const p = item.price;
  const sale = item.salePrice;
  return sale != null && sale > 0 ? sale : typeof p === "number" ? p : 0;
}

function lineTotal(item: CartItem): number {
  return unitPrice(item) * item.quantity;
}

export default function CartPageClient() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
    cartCount,
  } = useCart();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] pb-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-16 text-center">
          <div className="inline-flex items-center gap-2 mb-4 text-[#a156b4]/70 tracking-[0.2em] uppercase text-xs">
            <Sparkles className="w-4 h-4" />
            Cart
          </div>
          <h1
            style={{ fontFamily: "var(--font-heading)" }}
            className="text-3xl md:text-4xl text-[#a156b4] mb-4"
          >
            Your bag is empty
          </h1>
          <p className="text-gray-600 mb-8">
            Browse the shop and add products you love—everything you add will
            show up here.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 rounded-full bg-[#a156b4] px-8 py-3 text-white font-medium shadow-lg shadow-[#a156b4]/20 hover:bg-[#8e4a9f] transition-colors"
          >
            <ShoppingBag className="w-5 h-5" />
            Shop products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="inline-flex items-center gap-2 mb-2 text-[#a156b4]/70 tracking-[0.2em] uppercase text-xs">
          <Sparkles className="w-4 h-4" />
          Shopping bag
        </div>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <h1
            style={{ fontFamily: "var(--font-heading)" }}
            className="text-3xl md:text-4xl text-[#a156b4]"
          >
            Your cart
          </h1>
          <p className="text-sm text-gray-600">
            {cartCount} {cartCount === 1 ? "item" : "items"}
          </p>
        </div>

        <ul className="space-y-4">
          {cart.map((item) => {
            const name =
              typeof item.name === "string" && item.name.trim()
                ? item.name
                : `Product`;
            const image =
              typeof item.image === "string" && item.image.trim()
                ? item.image
                : PLACEHOLDER;
            const href = `/product/${encodeURIComponent(String(item.id))}`;

            return (
              <motion.li
                key={String(item.id)}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border border-[#E5C6ED]/50 shadow-sm overflow-hidden"
              >
                <div className="flex gap-4 p-4 sm:p-5">
                  <Link
                    href={href}
                    className="shrink-0 w-24 h-28 sm:w-28 sm:h-32 rounded-xl overflow-hidden bg-[#F5F5F5]"
                  >
                    <img
                      src={image}
                      alt=""
                      className="w-full h-full object-cover hover:opacity-90 transition-opacity"
                    />
                  </Link>

                  <div className="flex-1 min-w-0 flex flex-col">
                    <Link href={href}>
                      <h2 className="font-medium text-[#a156b4] hover:text-[#8e4a9f] transition-colors line-clamp-2">
                        {name}
                      </h2>
                    </Link>

                    <p className="text-sm text-gray-500 mt-1">
                      ${unitPrice(item).toFixed(2)} each
                    </p>

                    <div className="mt-auto pt-4 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center rounded-xl border border-[#E5C6ED] bg-[#F5F5F5]/50">
                        <button
                          type="button"
                          aria-label="Decrease quantity"
                          onClick={() => {
                            if (item.quantity <= 1) {
                              removeFromCart(item.id);
                            } else {
                              updateQuantity(item.id, item.quantity - 1);
                            }
                          }}
                          className="p-2.5 text-[#a156b4] hover:bg-[#E5C6ED]/40 rounded-l-xl transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-9 text-center text-sm font-medium text-gray-800">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          aria-label="Increase quantity"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="p-2.5 text-[#a156b4] hover:bg-[#E5C6ED]/40 rounded-r-xl transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        <span
                          style={{ fontFamily: "var(--font-heading)" }}
                          className="text-lg text-[#a156b4]"
                        >
                          ${lineTotal(item).toFixed(2)}
                        </span>
                        <button
                          type="button"
                          aria-label={`Remove ${name} from cart`}
                          onClick={() => removeFromCart(item.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.li>
            );
          })}
        </ul>

        <div className="mt-8 bg-white rounded-2xl border border-[#E5C6ED]/50 p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center text-lg">
            <span className="text-gray-700">Subtotal</span>
            <span
              style={{ fontFamily: "var(--font-heading)" }}
              className="text-2xl text-[#a156b4]"
            >
              ${cartTotal.toFixed(2)}
            </span>
          </div>
          <p className="text-xs text-gray-500">
            Shipping and taxes calculated at checkout (demo store).
          </p>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={() => clearCart()}
              className="sm:flex-1 py-3 rounded-xl border border-[#E5C6ED] text-gray-700 hover:bg-[#F5F5F5] transition-colors text-sm font-medium"
            >
              Clear cart
            </button>
            <Link
              href="/shop"
              className="sm:flex-1 py-3 rounded-xl bg-[#a156b4] text-white text-center text-sm font-medium hover:bg-[#8e4a9f] transition-colors shadow-md shadow-[#a156b4]/20"
            >
              Continue shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
