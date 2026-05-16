import type { CartItem } from "@/lib/stores/cartStore";
import type { WishlistItem } from "@/lib/stores/wishlistStore";
import type { ProductListPayload } from "@/lib/products-data";
import { productPayloadToShopProduct } from "@/lib/products-data";

type CategoryEmbed = {
  id?: string | number;
  title?: string | null;
  name?: string | null;
};

type ProductEmbed = {
  id?: number | string;
  title?: string;
  price?: number;
  price_after_sale?: number | null;
  images?: unknown;
  category_id?: string | number | null;
  category?: CategoryEmbed | CategoryEmbed[] | null;
};

function categoryNameFromProductEmbed(embed: ProductEmbed): string | null {
  const c = embed.category;
  if (c == null) return null;
  const row = Array.isArray(c) ? c[0] : c;
  if (!row || typeof row !== "object") return null;
  const label = row.title ?? row.name;
  return typeof label === "string" && label.trim() ? label.trim() : null;
}

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
    category_id: embed.category_id ?? null,
    category_name: categoryNameFromProductEmbed(embed) ?? null,
  };
  const shop = productPayloadToShopProduct(payload);
  return {
    id: shop.id,
    name: shop.name,
    price: shop.price,
    salePrice: shop.salePrice,
    image: shop.image,
    quantity: qty,
    category: shop.category,
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
    category_id: embed.category_id ?? null,
    category_name: categoryNameFromProductEmbed(embed) ?? null,
  };
  const shop = productPayloadToShopProduct(payload);
  return {
    id: shop.id,
    name: shop.name,
    price: shop.price,
    salePrice: shop.salePrice,
    image: shop.image,
    category: shop.category,
  };
}
