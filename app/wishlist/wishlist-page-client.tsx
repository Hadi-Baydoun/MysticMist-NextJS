"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Sparkles, Trash2 } from "lucide-react";

import { useWishlist, type WishlistItem } from "@/lib/stores/wishlistStore";

const PLACEHOLDER =
  "https://placehold.co/600x800/e8d4ef/a156b4?text=Product";

function displayPrice(item: WishlistItem): number {
  const sale = item.salePrice;
  const p = item.price;
  if (sale != null && sale > 0) return sale;
  if (typeof p === "number") return p;
  return 0;
}

export default function WishlistPageClient() {
  const { wishlist, removeFromWishlist, moveToCart } = useWishlist();

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] pb-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-16 text-center">
          <div className="inline-flex items-center gap-2 mb-4 text-[#a156b4]/70 tracking-[0.2em] uppercase text-xs">
            <Sparkles className="w-4 h-4" />
            Wishlist
          </div>
          <h1
            style={{ fontFamily: "var(--font-heading)" }}
            className="text-3xl md:text-4xl text-[#a156b4] mb-4"
          >
            No saved items yet
          </h1>
          <p className="text-gray-600 mb-8">
            Tap the heart on a product to save it here. When you&apos;re ready,
            move favorites to your cart in one click.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 rounded-full bg-[#a156b4] px-8 py-3 text-white font-medium shadow-lg shadow-[#a156b4]/20 hover:bg-[#8e4a9f] transition-colors"
          >
            <Heart className="w-5 h-5" />
            Explore the shop
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
          Saved for later
        </div>
        <h1
          style={{ fontFamily: "var(--font-heading)" }}
          className="text-3xl md:text-4xl text-[#a156b4] mb-8"
        >
          Wishlist
        </h1>

        <ul className="space-y-4">
          {wishlist.map((item) => {
            const name =
              typeof item.name === "string" && item.name.trim()
                ? item.name
                : `Product`;
            const image =
              typeof item.image === "string" && item.image.trim()
                ? item.image
                : PLACEHOLDER;
            const href = `/product/${encodeURIComponent(String(item.id))}`;
            const price = displayPrice(item);
            const showStrike =
              item.salePrice != null &&
              item.salePrice > 0 &&
              typeof item.price === "number" &&
              item.salePrice < item.price;

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

                    <div className="mt-2 flex items-baseline gap-2">
                      <span
                        style={{ fontFamily: "var(--font-heading)" }}
                        className="text-lg text-[#a156b4]"
                      >
                        ${price.toFixed(2)}
                      </span>
                      {showStrike ? (
                        <span className="text-sm text-gray-400 line-through">
                          ${Number(item.price).toFixed(2)}
                        </span>
                      ) : null}
                    </div>

                    <div className="mt-auto pt-4 flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => moveToCart(item)}
                        className="inline-flex items-center gap-2 rounded-xl bg-[#a156b4] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#8e4a9f] transition-colors shadow-md shadow-[#a156b4]/15"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        Add to cart
                      </button>
                      <button
                        type="button"
                        aria-label={`Remove ${name} from wishlist`}
                        onClick={() => removeFromWishlist(item.id)}
                        className="inline-flex items-center gap-2 rounded-xl border border-[#E5C6ED] px-4 py-2.5 text-sm text-gray-700 hover:bg-[#F5F5F5] transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </motion.li>
            );
          })}
        </ul>

        <p className="mt-8 text-center text-sm text-gray-500">
          <Link href="/shop" className="text-[#a156b4] hover:underline">
            Back to shop
          </Link>
        </p>
      </div>
    </div>
  );
}
