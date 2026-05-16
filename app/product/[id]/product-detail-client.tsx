"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  Heart,
  Minus,
  Plus,
  ShoppingBag,
  Sparkles,
} from "lucide-react";

import type { ShopProductDetail } from "@/lib/products-data";
import { useCart } from "@/lib/stores/cartStore";
import { useWishlist } from "@/lib/stores/wishlistStore";

export function ProductDetailClient({ product }: { product: ShopProductDetail }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const inWishlist = isInWishlist(product.id);
  const displayPrice = product.salePrice ?? product.price;
  const canAdd = product.stock > 0;
  const maxQty = product.stock > 0 ? product.stock : 1;

  const bumpQty = (delta: number) => {
    setQuantity((q) => {
      const next = q + delta;
      if (next < 1) return 1;
      if (next > maxQty) return maxQty;
      return next;
    });
  };

  const handleAddToCart = () => {
    if (!canAdd) return;
    addToCart(
      {
        id: product.id,
        name: product.name,
        image: product.image,
        price: product.price,
        salePrice: product.salePrice,
      },
      quantity,
    );
  };

  const toggleWishlist = () => {
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        image: product.image,
        price: product.price,
        salePrice: product.salePrice,
      });
    }
  };

  const mainImage = product.images[activeIndex] ?? product.image;

  return (
    <div className="min-h-screen bg-[#F5F5F5] pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-sm text-[#a156b4] hover:text-[#8e4a9f] transition-colors mb-8"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to shop
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-white border border-[#E5C6ED]/50 shadow-[var(--mystic-card-shadow)]"
            >
              <img
                src={mainImage}
                alt={product.name}
                className="w-full h-full object-cover"
              />

              <button
                type="button"
                onClick={toggleWishlist}
                aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
                className="absolute top-4 right-4 z-10 p-3 rounded-full bg-white/95 border border-[#E5C6ED]/60 text-[#a156b4] shadow-md hover:bg-[#E5C6ED]/30 transition-colors"
              >
                <Heart
                  className={`w-5 h-5 ${inWishlist ? "fill-[#a156b4]" : ""}`}
                />
              </button>
            </motion.div>

            {product.images.length > 1 ? (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((src, i) => (
                  <button
                    key={`${src}-${i}`}
                    type="button"
                    onClick={() => setActiveIndex(i)}
                    className={`shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      i === activeIndex
                        ? "border-[#a156b4] ring-2 ring-[#a156b4]/25"
                        : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={src}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 text-[#a156b4]/70 tracking-[0.2em] uppercase text-xs font-light">
              <Sparkles className="w-4 h-4 text-[#a156b4]" />
              {product.category ?? "Product"}
            </div>

            <h1
              style={{ fontFamily: "var(--font-heading)" }}
              className="text-4xl md:text-5xl text-[#a156b4] leading-tight"
            >
              {product.name}
            </h1>

            <div className="flex flex-wrap gap-2">
              {product.specialTags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full text-xs bg-[#E5C6ED]/40 text-[#a156b4] border border-[#E5C6ED]/60"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex items-baseline gap-3">
              <span
                style={{ fontFamily: "var(--font-heading)" }}
                className="text-3xl text-[#a156b4]"
              >
                ${displayPrice}
              </span>
              {product.salePrice != null &&
                product.salePrice < product.price && (
                  <span
                    style={{ fontFamily: "var(--font-heading)" }}
                    className="text-xl text-gray-400 line-through"
                  >
                    ${product.price}
                  </span>
                )}
            </div>

            <p className="text-sm text-gray-600">
              {product.stock > 0 ? (
                <>
                  <span className="font-medium text-[#a156b4]">
                    {product.stock}
                  </span>{" "}
                  in stock
                </>
              ) : (
                <span className="text-red-600 font-medium">Out of stock</span>
              )}
            </p>

            {product.description ? (
              <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed whitespace-pre-line border-t border-[#E5C6ED]/50 pt-6">
                {product.description}
              </div>
            ) : (
              <p className="text-gray-500 text-sm border-t border-[#E5C6ED]/50 pt-6">
                No description available for this item.
              </p>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-4">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">Quantity</span>
                <div className="flex items-center rounded-xl border border-[#E5C6ED] bg-white">
                  <button
                    type="button"
                    onClick={() => bumpQty(-1)}
                    disabled={quantity <= 1}
                    className="p-3 text-[#a156b4] disabled:opacity-40"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center font-medium text-gray-800">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => bumpQty(1)}
                    disabled={quantity >= maxQty || !canAdd}
                    className="p-3 text-[#a156b4] disabled:opacity-40"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!canAdd}
                style={{ fontFamily: "var(--font-heading)" }}
                className="inline-flex items-center justify-center gap-2 flex-1 sm:flex-none min-w-[200px] px-8 py-4 rounded-full bg-[#a156b4] text-white font-medium shadow-lg shadow-[#a156b4]/25 hover:bg-[#8e4a9f] disabled:opacity-45 disabled:cursor-not-allowed transition-colors"
              >
                <ShoppingBag className="w-5 h-5" />
                Add to bag
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
