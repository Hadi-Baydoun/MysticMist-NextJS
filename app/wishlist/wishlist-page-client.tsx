"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  ShoppingBag,
  Sparkles,
  Trash2,
  ChevronRight,
} from "lucide-react";

import { cartCategoryDisplayLabel } from "@/lib/categories-data";
import { useWishlist, type WishlistItem } from "@/lib/stores/wishlistStore";

const PLACEHOLDER =
  "https://placehold.co/400x520/f0e4f5/a156b4?text=Mystic+Mist";

function displayPrice(item: WishlistItem): number {
  const sale = item.salePrice;
  const p = item.price;
  if (sale != null && sale > 0) return sale;
  if (typeof p === "number") return p;
  return 0;
}

function EmptyWishlist() {
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
          <Heart className="h-10 w-10 text-[#a156b4]" strokeWidth={1.25} />
        </div>

        <div className="mb-3 flex items-center justify-center gap-2 text-[11px] font-medium uppercase tracking-[0.35em] text-[#a156b4]/80">
          <Sparkles className="h-3 w-3 text-[#c4a0b4]" />
          Mystic Mist
        </div>

        <h1 className="font-heading text-4xl tracking-tight text-[#2d1f35] md:text-5xl">
          No saved items <span className="italic text-[#a156b4]">yet</span>
        </h1>

        <p className="mt-5 text-sm leading-relaxed text-[#7a6070]">
          Tap the heart on a product to save it here. When you&apos;re ready,
          move favorites to your bag in one click.
        </p>

        <Link
          href="/shop"
          className="font-heading mt-10 inline-flex max-w-xs items-center justify-center gap-2.5 rounded-full bg-[#a156b4] px-8 py-4 text-base font-medium tracking-wide text-white transition-all duration-200 hover:bg-[#8e4a9f] active:scale-95"
        >
          <ShoppingBag className="h-4 w-4" strokeWidth={2} />
          Explore the shop
        </Link>
      </div>
    </div>
  );
}

export default function WishlistPageClient() {
  const { wishlist, removeFromWishlist, moveToCart } = useWishlist();

  if (wishlist.length === 0) return <EmptyWishlist />;

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
          <h1 className="font-heading text-4xl tracking-tight text-[#2d1f35] md:text-5xl lg:text-6xl">
            My <span className="italic text-[#a156b4]">wishlist</span>
          </h1>

          <div
            className="my-6 h-px w-full max-w-xl"
            style={{
              background:
                "linear-gradient(90deg, #E5C6ED, rgba(229,198,237,0.2))",
            }}
          />

          <p className="mb-8 text-xs uppercase tracking-[0.2em] text-[#b07090]">
            {wishlist.length} {wishlist.length === 1 ? "item" : "items"} saved
            for later
          </p>
        </motion.div>

        <div className="min-w-0 max-w-3xl">
          <AnimatePresence>
            {wishlist.map((item, i) => {
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
              const price = displayPrice(item);
              const showStrike =
                item.salePrice != null &&
                item.salePrice > 0 &&
                typeof item.price === "number" &&
                item.salePrice < item.price;

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

                        <div className="mt-2 flex flex-wrap items-baseline gap-2">
                          <span className="font-heading text-xl text-[#a156b4] md:text-2xl">
                            ${price.toFixed(2)}
                          </span>
                          {showStrike ? (
                            <span className="text-sm text-[#c4a0b4] line-through">
                              ${Number(item.price).toFixed(2)}
                            </span>
                          ) : null}
                        </div>

                        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-4">
                          <button
                            type="button"
                            onClick={() => moveToCart(item)}
                            className="font-heading inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-[#a156b4] px-5 py-2.5 text-sm font-medium tracking-wide text-white transition-all duration-200 hover:bg-[#8e4a9f] active:scale-[0.98] sm:px-6 sm:py-3 sm:text-base"
                          >
                            <ShoppingBag className="h-4 w-4" />
                            Add to bag
                          </button>

                          <button
                            type="button"
                            className="rounded-full p-2 text-[#c4a0b4] transition-all hover:scale-110 hover:text-red-500"
                            aria-label={`Remove ${name} from wishlist`}
                            onClick={() => removeFromWishlist(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          <Link
            href="/shop"
            className="mt-4 inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border border-[#E5C6ED] bg-white/60 px-5 py-3 text-xs uppercase tracking-[0.18em] text-[#b07090] backdrop-blur-sm transition-all hover:border-[#a156b4]/35 hover:bg-[#a156b4]/5 hover:text-[#a156b4]"
          >
            <ChevronRight className="h-3.5 w-3.5 mt-[-2px]" />
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
