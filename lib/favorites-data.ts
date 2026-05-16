import { unstable_cache } from "next/cache";

import { createClient } from "@supabase/supabase-js";

// ─── Types

type Category = { id: number | string; title: string | null };
type SpecialTag = { id: number | string; name: string | null };

export type FavoriteProductRow = {
  id: number | string;
  title: string;
  price: number;
  price_after_sale: number | null;
  images: string[];
  category: Category[] | null;
  special_tags: SpecialTag[] | null;
};

export type FavoriteProduct = {
  id: number | string;
  title: string;
  price: number;
  price_after_sale: number | null;
  images: string[];
  category_name: string | null;
  special_tag_name: string | null;
};

export type FavoriteCarouselProduct = {
  id: string | number;
  name: string;
  category: string;
  price: number;
  salePrice?: number;
  specialTags: string[];
  image: string;
};

export type FetchFavoriteProductsResult =
  | { ok: true; products: FavoriteProduct[] }
  | { ok: false; error: string };

const FAVORITES_SELECT = `
  id,
  title,
  price,
  price_after_sale,
  images,
  category ( id, title ),
  special_tags ( id, name )
` as const;

// ─── Helpers

function toSingle<T>(value: T | T[] | null | undefined): T | null {
  if (value == null) return null;
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

export function favoriteRowToProduct(row: FavoriteProductRow): FavoriteProduct {
  const { category, special_tags, ...rest } = row;
  return {
    ...rest,
    category_name: toSingle(category)?.title ?? null,
    special_tag_name: toSingle(special_tags)?.name ?? null,
  };
}

/** Resolves primary image URL from Supabase shapes or placeholders. */
export function primaryFavoriteImage(images: unknown): string {
  if (Array.isArray(images)) {
    for (const item of images) {
      if (typeof item === "string" && item.trim()) return item.trim();
      if (item && typeof item === "object" && "url" in item) {
        const u = (item as { url?: unknown }).url;
        if (typeof u === "string" && u.trim()) return u.trim();
      }
    }
  }
  if (typeof images === "string" && images.trim()) return images.trim();
  return "";
}

export function favoriteProductToCarousel(
  p: FavoriteProduct,
): FavoriteCarouselProduct {
  const price = typeof p.price === "number" ? p.price : 0;
  const after = p.price_after_sale;
  const salePrice =
    after != null &&
    typeof after === "number" &&
    typeof p.price === "number" &&
    after < p.price
      ? after
      : undefined;

  const tag =
    typeof p.special_tag_name === "string" && p.special_tag_name.trim()
      ? p.special_tag_name.trim()
      : null;

  return {
    id: p.id,
    name: typeof p.title === "string" ? p.title : "",
    category:
      typeof p.category_name === "string" && p.category_name.trim()
        ? p.category_name.trim()
        : "—",
    price,
    salePrice,
    specialTags: tag ? [tag] : [],
    image: primaryFavoriteImage(p.images),
  };
}

async function fetchFavoriteProductsUncached(): Promise<FetchFavoriteProductsResult> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    return { ok: false, error: "Missing Supabase configuration" };
  }

  const supabase = createClient(url, key);

  const { data, error } = await supabase
    .from("products")
    .select(FAVORITES_SELECT)
    .not("special_tag_id", "is", null);

  if (error) {
    return { ok: false, error: error.message };
  }

  const products = (data as FavoriteProductRow[]).map(favoriteRowToProduct);
  return { ok: true, products };
}

/** Server-only: load favorites from DB (cached briefly for repeat home visits). */
export async function fetchFavoriteProducts(): Promise<FetchFavoriteProductsResult> {
  return unstable_cache(
    fetchFavoriteProductsUncached,
    ["homepage-favorites"],
    { revalidate: 120 },
  )();
}
