"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  Sparkles,
  Heart,
  ChevronRight,
  Gift,
  Truck,
} from "lucide-react";

import { cartCategoryDisplayLabel } from "@/lib/categories-data";
import { useCart, type CartItem } from "@/lib/stores/cartStore";

const PLACEHOLDER =
  "https://placehold.co/400x520/f0e4f5/a156b4?text=Mystic+Mist";

/** WhatsApp order line (E.164 without +). */
const WHATSAPP_ORDER_PHONE = "96176936883";

function cartItemDisplayName(item: CartItem): string {
  return typeof item.name === "string" && item.name.trim()
    ? item.name.trim()
    : "Product";
}

function buildWhatsAppOrderMessage(
  items: CartItem[],
  subtotal: number,
  delivery: number,
  total: number,
): string {
  const lines: string[] = [
    "Hi! I'd like to place an order",
    "",
    "Order details:",
    ...items.map((item, i) => {
      const category = cartCategoryDisplayLabel(item.category);
      const product = cartItemDisplayName(item);
      const qty = item.quantity;
      return `${i + 1}) Category: ${category} | Product: ${product} | Qty: ${qty}`;
    }),
    "",
    `Subtotal: $${subtotal.toFixed(2)}`,
    `Delivery: $${delivery.toFixed(2)}`,
    `Total: $${total.toFixed(2)}`,
    "",
    "Thank you!",
  ];
  return lines.join("\n");
}

function openWhatsAppOrder(
  items: CartItem[],
  subtotal: number,
  delivery: number,
  total: number,
) {
  const text = buildWhatsAppOrderMessage(items, subtotal, delivery, total);
  const url = `https://wa.me/${WHATSAPP_ORDER_PHONE}?text=${encodeURIComponent(text)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

function unitPrice(item: CartItem): number {
  const p = item.price;
  const sale = item.salePrice;
  return sale != null && sale > 0 ? sale : typeof p === "number" ? p : 0;
}
function lineTotal(item: CartItem): number {
  return unitPrice(item) * item.quantity;
}

function EmptyCart() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#F5F0F7]">
      <div
        className="pointer-events-none fixed inset-0 overflow-hidden"
        aria-hidden
      >
        <div className="absolute -top-24 right-0 h-72 w-72 rounded-full bg-[#a156b4]/7 blur-3xl" />
        <div className="absolute bottom-0 -left-16 h-64 w-64 rounded-full bg-[#E5C6ED]/35 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-lg px-4 py-20 text-center md:py-28">
        <div
          className="mx-auto mb-8 flex h-28 w-28 items-center justify-center rounded-full shadow-(--mystic-card-shadow)"
          style={{
            background: "linear-gradient(145deg, #fdf0f8 0%, #E5C6ED 100%)",
          }}
        >
          <ShoppingBag
            className="h-10 w-10 text-[#a156b4]"
            strokeWidth={1.25}
          />
        </div>

        <div className="mb-3 flex items-center justify-center gap-2 text-[11px] font-medium uppercase tracking-[0.35em] text-[#a156b4]/80">
          <Sparkles className="h-3 w-3 text-[#c4a0b4]" />
          Mystic Mist
        </div>

        <h1 className="font-heading text-4xl tracking-tight text-[#2d1f35] md:text-5xl">
          Your bag is <span className="italic text-[#a156b4]">empty</span>
        </h1>

        <p className="mt-5 text-sm leading-relaxed text-[#7a6070]">
          Explore our collection of body mists and lotions—layered fragrances
          and silky textures made for your everyday ritual.
        </p>

        <Link
          href="/shop"
          className="font-heading mt-10 inline-flex max-w-xs items-center justify-center gap-2.5 rounded-full bg-[#a156b4] px-8 py-4 text-base font-medium tracking-wide text-white transition-all duration-200 hover:bg-[#8e4a9f] active:scale-95"
        >
          <Heart className="h-4 w-4" strokeWidth={2} />
          Explore the shop
        </Link>
      </div>
    </div>
  );
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

  if (cart.length === 0) return <EmptyCart />;

  const shipping = 4;
  const orderTotal = cartTotal + shipping;

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#F5F0F7] pt-10">
      <div
        className="pointer-events-none fixed inset-0 overflow-hidden"
        aria-hidden
      >
        <div className="absolute -top-24 right-0 h-80 w-80 rounded-full bg-[#a156b4]/6 blur-3xl" />
        <div className="absolute bottom-20 -left-20 h-72 w-72 rounded-full bg-[#E5C6ED]/30 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-20 pt-10 md:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
        >
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h1 className="font-heading text-4xl tracking-tight text-[#2d1f35] md:text-5xl lg:text-6xl">
              My <span className="italic text-[#a156b4]">bag</span>
            </h1>
            <button
              type="button"
              onClick={clearCart}
              className="border-none cursor-pointer bg-transparent text-[11px] uppercase tracking-[0.18em] text-[#c4a0b4] underline decoration-[#E5C6ED] underline-offset-4 transition-colors hover:text-[#a156b4]"
            >
              Clear all
            </button>
          </div>

          <div
            className="my-6 h-px w-full max-w-xl"
            style={{
              background:
                "linear-gradient(90deg, #E5C6ED, rgba(229,198,237,0.2))",
            }}
          />

          <p className="mb-8 text-xs uppercase tracking-[0.2em] text-[#b07090]">
            {cartCount} {cartCount === 1 ? "item" : "items"} in your bag
          </p>
        </motion.div>

        <div className="flex flex-col items-stretch gap-8 lg:flex-row lg:gap-10">
          <div className="min-w-0 flex-1">
            <AnimatePresence>
              {cart.map((item, i) => {
                const name =
                  typeof item.name === "string" && item.name.trim()
                    ? item.name
                    : "Product";
                const image =
                  typeof item.image === "string" && item.image.trim()
                    ? item.image
                    : PLACEHOLDER;
                const href = `/product/${encodeURIComponent(String(item.id))}`;
                const label = cartCategoryDisplayLabel(item.category);

                return (
                  <motion.div
                    key={String(item.id)}
                    layout
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 16, scale: 0.98 }}
                    transition={{ duration: 0.35, delay: i * 0.06 }}
                    className="mb-4"
                  >
                    <div className="overflow-hidden rounded-2xl border border-[#E5C6ED]/90 bg-white/75 shadow-(--mystic-card-shadow) backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_48px_-14px_rgba(161,86,180,0.4)]">
                      <div className="flex gap-4 p-4 sm:gap-5 sm:p-5">
                        <Link href={href} className="shrink-0">
                          <img
                            src={image}
                            alt={name}
                            className="h-[120px] w-[92px] rounded-xl object-cover transition-transform duration-300 hover:scale-[1.03] sm:h-[130px] sm:w-[100px]"
                          />
                        </Link>

                        <div className="flex min-w-0 flex-1 flex-col">
                          <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#b07090]">
                            {label}
                          </div>
                          <Link href={href} className="mt-1 no-underline">
                            <span className="font-heading text-xl text-[#2d1f35] transition-colors hover:text-[#a156b4] md:text-2xl">
                              {name}
                            </span>
                          </Link>
                          {item.quantity > 1 && (
                            <p className="mt-1 text-xs text-[#7a6070]">
                              ${unitPrice(item).toFixed(2)} each
                            </p>
                          )}

                          <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-4">
                            <div
                              className="inline-flex items-center rounded-full bg-white/90"
                              style={{ border: "1px solid #E5C6ED" }}
                            >
                              <button
                                type="button"
                                className="flex h-9 w-9 items-center justify-center text-[#a156b4] transition-colors hover:bg-[#a156b4]/10"
                                aria-label="Decrease quantity"
                                onClick={() =>
                                  item.quantity <= 1
                                    ? removeFromCart(item.id)
                                    : updateQuantity(item.id, item.quantity - 1)
                                }
                              >
                                <Minus className="h-3.5 w-3.5" />
                              </button>
                              <span className="min-w-8 text-center text-sm font-medium text-[#a156b4]">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                className="flex h-9 w-9 items-center justify-center text-[#a156b4] transition-colors hover:bg-[#a156b4]/10"
                                aria-label="Increase quantity"
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity + 1)
                                }
                              >
                                <Plus className="h-3.5 w-3.5" />
                              </button>
                            </div>

                            <div className="flex items-center gap-3">
                              <span className="font-heading text-xl text-[#a156b4] md:text-2xl">
                                ${lineTotal(item).toFixed(2)}
                              </span>
                              <button
                                type="button"
                                className="rounded-full cursor-pointer p-2 text-[#c4a0b4] transition-all hover:scale-110 hover:text-red-500"
                                aria-label={`Remove ${name}`}
                                onClick={() => removeFromCart(item.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          <motion.div
            className="w-full shrink-0 lg:w-[360px]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.12 }}
          >
            <div className="sticky top-28 rounded-3xl border border-[#E5C6ED]/90 bg-white/70 p-6 shadow-(--mystic-card-shadow) backdrop-blur-xl md:p-8">
              <h2 className="font-heading text-xl text-[#2d1f35] md:text-2xl">
                Order summary
              </h2>

              <div className="mt-5 space-y-2.5 text-sm text-[#7a6070]">
                <div className="flex justify-between gap-4">
                  <span>Subtotal ({cartCount} items)</span>
                  <span className="shrink-0 font-medium text-[#2d1f35]">
                    ${cartTotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span>Shipping</span>
                  <span className="shrink-0 font-medium text-[#2d1f35]">
                    ${shipping.toFixed(2)}
                  </span>
                </div>
              </div>

              <div
                className="mt-5 flex items-center justify-between border-t border-[#E5C6ED] pt-5"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                <span className="text-lg text-[#2d1f35]">Total</span>
                <span className="text-3xl font-light tracking-tight text-[#a156b4]">
                  ${orderTotal.toFixed(2)}
                </span>
              </div>

              <div className="mt-7 flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() =>
                    openWhatsAppOrder(cart, cartTotal, shipping, orderTotal)
                  }
                  className="font-heading inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#a156b4] px-6 py-4 text-base font-medium tracking-wide text-white transition-all duration-200 hover:bg-[#8e4a9f] active:scale-[0.98]"
                >
                  <Sparkles className="h-4 w-4" />
                  Place order
                </button>
                <Link
                  href="/shop"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#E5C6ED] bg-transparent px-6 py-3.5 text-xs uppercase tracking-[0.18em] text-[#b07090] transition-all hover:border-[#a156b4]/35 hover:bg-[#a156b4]/5 hover:text-[#a156b4]"
                >
                  <ShoppingBag className="h-3.5 w-3.5" />
                  Keep shopping
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
