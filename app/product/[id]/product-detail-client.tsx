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

export function ProductDetailClient({
  product,
}: {
  product: ShopProductDetail;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const inWishlist = isInWishlist(product.id);
  const displayPrice = product.salePrice ?? product.price;
  const canAdd = product.stock > 0;
  const maxQty = product.stock > 0 ? product.stock : 1;
  const isOnSale =
    product.salePrice != null && product.salePrice < product.price;

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
        category: product.category,
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
        category: product.category,
      });
    }
  };

  const mainImage = product.images[activeIndex] ?? product.image;

  return (
    <div className="min-h-screen bg-[#F5F0F7] py-20">
      {/* Back link */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-6">
        <Link
          href="/shop"
          className="inline-flex items-center gap-1.5 text-xs tracking-widest uppercase text-[#b07090] hover:text-[#a156b4] transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          Back to shop
        </Link>
      </div>

      {/* Main grid */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 mt-8 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
        {/* ── Image column ── */}
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="relative aspect-3/3 rounded-[28px] overflow-hidden"
            style={{
              background: "linear-gradient(160deg, #fdf0f8 0%, #f0e4f5 100%)",
              boxShadow: "inset 0 0 0 1px rgba(161,86,180,0.1)",
            }}
          >
            <img
              src={mainImage}
              alt={product.name}
              className="w-full h-full object-cover"
            />

            {/* Sale ribbon */}
            {isOnSale && (
              <div className="absolute top-5 left-5">
                <span
                  className="text-[10px] tracking-[0.2em] uppercase font-medium px-3 py-1.5 rounded-full text-white"
                  style={{ background: "#a156b4" }}
                >
                  Sale
                </span>
              </div>
            )}

            {/* Wishlist button */}
            <button
              type="button"
              onClick={toggleWishlist}
              aria-label={
                inWishlist ? "Remove from wishlist" : "Add to wishlist"
              }
              className="absolute top-5 right-5 z-10 flex items-center gap-2 px-4 py-2.5 rounded-full transition-all duration-200 cursor-pointer"
              style={{
                background: inWishlist ? "#E5C6ED" : "rgba(255,255,255,0.92)",
                border: "1px solid #e0c8d8",
                backdropFilter: "blur(6px)",
              }}
            >
              <Heart
                className="w-4 h-4"
                style={{ color: "#a156b4" }}
                fill={inWishlist ? "#a156b4" : "none"}
              />
              <span className="text-[11px] tracking-widest uppercase text-[#a156b4] font-medium">
                {inWishlist ? "Remove from wishlist" : "Add to wishlist"}
              </span>
            </button>
          </motion.div>

          {/* Thumbnail strip */}
          {product.images.length > 1 && (
            <div className="flex gap-2.5 overflow-x-auto pb-1">
              {product.images.map((src, i) => (
                <button
                  key={`${src}-${i}`}
                  type="button"
                  onClick={() => setActiveIndex(i)}
                  className="shrink-0 w-16 h-16 rounded-2xl overflow-hidden transition-all duration-200"
                  style={{
                    border:
                      i === activeIndex
                        ? "2px solid #a156b4"
                        : "2px solid transparent",
                    opacity: i === activeIndex ? 1 : 0.5,
                  }}
                  onMouseEnter={(e) => {
                    if (i !== activeIndex)
                      (e.currentTarget as HTMLButtonElement).style.opacity =
                        "0.8";
                  }}
                  onMouseLeave={(e) => {
                    if (i !== activeIndex)
                      (e.currentTarget as HTMLButtonElement).style.opacity =
                        "0.5";
                  }}
                >
                  <img
                    src={src}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Details column ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="space-y-7 lg:pt-6"
        >
          {/* Eyebrow with decorative rules */}
          <div className="flex items-center gap-3">
            <span className="h-px w-6 bg-[#E5C6ED]" />
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-[#c4a0b4]" />
              <span className="text-[10px] tracking-[0.22em] uppercase text-[#b07090] font-medium">
                {product.category ?? "Product"}
              </span>
            </div>
            <span className="h-px w-6 bg-[#E5C6ED]" />
          </div>

          {/* Product name */}
          <h1
            style={{ fontFamily: "var(--font-heading)", lineHeight: "1.05" }}
            className="text-5xl md:text-6xl text-[#a156b4] tracking-tight"
          >
            {product.name}
          </h1>

          {/* Special tags */}
          {product.specialTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.specialTags.map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-1.5 rounded-full text-[11px] tracking-widest uppercase font-medium bg-white border text-[#a156b4]"
                  style={{ borderColor: "#E5C6ED" }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-3 pt-1">
            <span
              style={{ fontFamily: "var(--font-heading)" }}
              className="text-4xl text-[#a156b4]"
            >
              ${displayPrice}
            </span>
            {isOnSale && (
              <>
                <span
                  style={{ fontFamily: "var(--font-heading)" }}
                  className="text-2xl text-[#c4a0b4] line-through"
                >
                  ${product.price}
                </span>
                <span
                  className="text-[10px] tracking-[0.2em] uppercase font-medium px-3 py-1 rounded-full text-white"
                  style={{ background: "#a156b4" }}
                >
                  Sale
                </span>
              </>
            )}
          </div>

          {/* Stock */}
          <div className="flex items-center gap-2">
            {product.stock > 0 ? (
              <>
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: "#a156b4" }}
                />
                <p className="text-sm text-[#b07090]">
                  <span className="font-medium text-[#a156b4]">
                    {product.stock}
                  </span>{" "}
                  left in stock
                </p>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full flex-shrink-0 bg-red-300" />
                <p className="text-sm text-red-500 font-medium">Out of stock</p>
              </>
            )}
          </div>

          {/* Divider */}
          <div
            className="h-px w-full"
            style={{
              background: "linear-gradient(90deg, #E5C6ED, transparent)",
            }}
          />

          {/* Description */}
          {product.description ? (
            <p className="text-sm text-[#7a6070] leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          ) : (
            <p className="text-sm text-[#b07090]">
              No description available for this item.
            </p>
          )}

          {/* Divider */}
          <div
            className="h-px w-full"
            style={{
              background: "linear-gradient(90deg, #E5C6ED, transparent)",
            }}
          />

          {/* Quantity + Add to bag */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-1">
            {/* Quantity picker */}
            <div className="flex items-center gap-3">
              <span className="text-[11px] tracking-widest uppercase text-[#b07090]">
                Qty
              </span>
              <div
                className="flex items-center rounded-full bg-white"
                style={{ border: "1px solid #E5C6ED" }}
              >
                <button
                  type="button"
                  onClick={() => bumpQty(-1)}
                  disabled={quantity <= 1}
                  className="p-3 text-[#a156b4] disabled:opacity-30 transition-opacity"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-9 text-center text-sm font-medium text-[#a156b4]">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => bumpQty(1)}
                  disabled={quantity >= maxQty || !canAdd}
                  className="p-3 text-[#a156b4] disabled:opacity-30 transition-opacity"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Add to bag */}
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!canAdd}
              style={{ fontFamily: "var(--font-heading)" }}
              className="
              inline-flex cursor-pointer items-center justify-center gap-2.5
              flex-1 sm:flex-none min-w-[200px]
              px-8 py-4 rounded-full
              bg-[#a156b4] hover:bg-[#8e4a9f]
              text-white font-medium text-base tracking-wide
              transition-all duration-200
              disabled:opacity-40 disabled:cursor-not-allowed
              active:scale-95
            "
            >
              <ShoppingBag className="w-4.5 h-4.5" />
              {canAdd ? "Add to bag" : "Out of stock"}
            </button>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap gap-4 pt-2">
            {[
              "Fast shipping",
              "Premium quality assurance",
              "Authentic & sealed",
            ].map((badge) => (
              <div key={badge} className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-[#c4a0b4]" />
                <span className="text-[11px] tracking-wide text-[#b07090]">
                  {badge}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
