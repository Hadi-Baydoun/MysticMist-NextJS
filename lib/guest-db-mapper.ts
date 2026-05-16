import type { CartItem } from "@/lib/stores/cartStore";
import type { WishlistItem } from "@/lib/stores/wishlistStore";
import type { ProductListPayload } from "@/lib/products-data";
import { productPayloadToShopProduct } from "@/lib/products-data";

type ProductEmbed = {
  id?: number | string;
  title?: string;
  price?: number;
  price_after_sale?: number | null;
  images?: unknown;
};

function asProductEmbed(v: unknown): ProductEmbed | null {
  if (v == null) return null;
  const p = Array.isArray(v) ? v[0] : v;
  if (p && typeof p === "object") return p as ProductEmbed;
  return null;
}

/** Normalize route / Zustand id for Supabase `product_id` (bigint or uuid). */
export function normalizeProductId(
  raw: string | number | undefined | null,
): string | number {
  if (raw == null) return "";
  if (typeof raw === "number" && Number.isFinite(raw)) return raw;
  const s = String(raw).trim();
  if (/^\d+$/.test(s)) return parseInt(s, 10);
  return s;
}

export function cartJoinToCartItem(
  row: { quantity?: number; product_id?: unknown; products?: unknown },
): CartItem | null {
  const qty =
    typeof row.quantity === "number" && row.quantity > 0 ? row.quantity : 1;
  const embed = asProductEmbed(row.products);
  if (!embed || embed.id == null) return null;

  const payload: ProductListPayload = {
    id: embed.id,
    title: embed.title,
    price: embed.price,
    price_after_sale: embed.price_after_sale ?? null,
    images: embed.images,
  };
  const shop = productPayloadToShopProduct(payload);
  return {
    id: shop.id,
    name: shop.name,
    price: shop.price,
    salePrice: shop.salePrice,
    image: shop.image,
    quantity: qty,
  };
}

export function wishlistJoinToItem(
  row: { product_id?: unknown; products?: unknown },
): WishlistItem | null {
  const embed = asProductEmbed(row.products);
  if (!embed || embed.id == null) return null;

  const payload: ProductListPayload = {
    id: embed.id,
    title: embed.title,
    price: embed.price,
    price_after_sale: embed.price_after_sale ?? null,
    images: embed.images,
  };
  const shop = productPayloadToShopProduct(payload);
  return {
    id: shop.id,
    name: shop.name,
    price: shop.price,
    salePrice: shop.salePrice,
    image: shop.image,
  };
}
