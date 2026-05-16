import { cache } from "react";
import { unstable_cache } from "next/cache";

import { createClient } from "@supabase/supabase-js";

type CategoryEmbed = {
  id?: string | number;
  name?: string | null;
  title?: string | null;
};

type SpecialTagEmbed = {
  id?: string | number;
  name?: string | null;
};

type TagEmbed = {
  id?: string | number;
  name?: string | null;
};

type ProductTagEmbed = {
  tag_id?: string | number;
  tags?: TagEmbed | TagEmbed[] | null;
};

type ProductRow = {
  id?: number | string;
  created_at?: string;
  title?: string;
  description?: string | null;
  stock?: number;
  price?: number;
  price_after_sale?: number | null;
  image?: string;
  images?: unknown;
  category_id?: string | number | null;
  special_tag_id?: string | number | null;
  category?: CategoryEmbed | CategoryEmbed[] | null;
  special_tags?: SpecialTagEmbed | SpecialTagEmbed[] | null;
  special_tag?: SpecialTagEmbed | SpecialTagEmbed[] | null;
  product_tags?: ProductTagEmbed[] | null;
};

/** Shape returned after flattening joins (matches former `GET /api/products`). */
export type ProductListPayload = {
  id?: number | string;
  created_at?: string;
  title?: string;
  description?: string | null;
  stock?: number;
  price?: number;
  price_after_sale?: number | null;
  image?: string;
  images?: unknown;
  category_id?: string | number | null;
  special_tag_id?: string | number | null;
  category_name?: string | null;
  special_tag_name?: string | null;
  tags?: { id?: string | number; name?: string | null }[] | null;
};

export type ShopCatalogProduct = {
  id: number | string;
  name: string;
  category?: string;
  categoryId?: string | number | null;
  price: number;
  salePrice?: number;
  /** True when `price_after_sale` is set in the database (may equal list price). */
  hasPriceAfterSale?: boolean;
  specialTags: string[];
  image: string;
  createdAt?: string;
};

/** Full product for `/product/[id]` (gallery, description, stock). */
export type ShopProductDetail = ShopCatalogProduct & {
  description: string | null;
  stock: number;
  images: string[];
};

export type FetchProductsResult =
  | { ok: true; products: ProductListPayload[] }
  | { ok: false; error: string };

export type FetchProductByIdResult =
  | { ok: true; product: ProductListPayload }
  | { ok: false; error: string };

function asSingle<T>(embed: T | T[] | null | undefined): T | null {
  if (embed == null) return null;
  return Array.isArray(embed) ? (embed[0] ?? null) : embed;
}

function categoryDisplayName(c: CategoryEmbed | null): string | null {
  if (!c) return null;
  const label = c.title ?? c.name;
  return typeof label === "string" && label ? label : null;
}

function tagsFromProductTags(
  rows: ProductTagEmbed[] | null | undefined,
): { id: string | number | undefined; name: string | null }[] | null {
  if (rows == null) return null;
  const out: { id: string | number | undefined; name: string | null }[] = [];
  for (const row of rows) {
    const t = asSingle(row.tags);
    if (!t) continue;
    out.push({ id: t.id, name: t.name ?? null });
  }
  return out.length > 0 ? out : null;
}

const PRODUCTS_SELECT = `
  *,
  category ( id, title ),
  special_tags ( id, name ),
  product_tags (
    tag_id,
    tags ( id, name )
  )
`;

const IMAGE_FALLBACK =
  "https://placehold.co/600x800/e8d4ef/a156b4?text=Product";

function primaryProductImage(images: unknown): string {
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
  return IMAGE_FALLBACK;
}

function collectProductImages(images: unknown): string[] {
  const urls: string[] = [];
  if (Array.isArray(images)) {
    for (const item of images) {
      if (typeof item === "string" && item.trim()) {
        urls.push(item.trim());
        continue;
      }
      if (item && typeof item === "object" && "url" in item) {
        const u = (item as { url?: unknown }).url;
        if (typeof u === "string" && u.trim()) urls.push(u.trim());
      }
    }
  } else if (typeof images === "string" && images.trim()) {
    urls.push(images.trim());
  }
  return [...new Set(urls)];
}

/** Parse dynamic route param for Supabase `products.id` (numeric or UUID string). */
export function parseProductRouteId(raw: string): string | number {
  const trimmed = raw.trim();
  if (/^\d+$/.test(trimmed)) return parseInt(trimmed, 10);
  return trimmed;
}

function rowToPayload(row: ProductRow): ProductListPayload {
  const {
    category: categoryEmbed,
    special_tags: specialTagsEmbed,
    special_tag: specialTagAlt,
    product_tags: productTagsEmbed,
    ...rest
  } = row;
  const special = asSingle(specialTagsEmbed) ?? asSingle(specialTagAlt);

  return {
    ...rest,
    category_name: categoryDisplayName(asSingle(categoryEmbed)),
    special_tag_name: special?.name ?? null,
    tags: tagsFromProductTags(productTagsEmbed),
  };
}

async function fetchProductsUncached(): Promise<FetchProductsResult> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    return { ok: false, error: "Missing Supabase configuration" };
  }

  const supabase = createClient(url, key);
  let { data, error } = await supabase.from("products").select(PRODUCTS_SELECT);

  if (error) {
    const altSelect = `
      *,
      category ( id, title ),
      special_tag:special_tags ( id, name ),
      product_tags (
        tag_id,
        tags ( id, name )
      )
    `;
    const second = await supabase.from("products").select(altSelect);
    data = second.data;
    error = second.error;
  }

  if (error) {
    return { ok: false, error: error.message };
  }

  const rows = (data ?? []) as ProductRow[];
  const products = rows.map(rowToPayload);
  return { ok: true, products };
}

/** Server-side product list for shop; cached briefly to speed repeat navigations. */
export async function fetchProducts(): Promise<FetchProductsResult> {
  return unstable_cache(
    fetchProductsUncached,
    ["catalog-products"],
    { revalidate: 60 },
  )();
}

async function fetchProductByIdUncached(
  parsedId: string | number,
): Promise<FetchProductByIdResult> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    return { ok: false, error: "Missing Supabase configuration" };
  }

  const supabase = createClient(url, key);

  let { data, error } = await supabase
    .from("products")
    .select(PRODUCTS_SELECT)
    .eq("id", parsedId)
    .maybeSingle();

  if (error) {
    const altSelect = `
      *,
      category ( id, title ),
      special_tag:special_tags ( id, name ),
      product_tags (
        tag_id,
        tags ( id, name )
      )
    `;
    const second = await supabase
      .from("products")
      .select(altSelect)
      .eq("id", parsedId)
      .maybeSingle();
    data = second.data;
    error = second.error;
  }

  if (error) {
    return { ok: false, error: error.message };
  }

  if (data == null) {
    return { ok: false, error: "Not found" };
  }

  const row = data as ProductRow;
  return { ok: true, product: rowToPayload(row) };
}

/**
 * PDP data: React `cache` merges `generateMetadata` + page into one fetch per navigation;
 * `unstable_cache` keeps warm results for revisits (~2 min).
 */
export const fetchProductById = cache(async function fetchProductById(
  rawId: string,
): Promise<FetchProductByIdResult> {
  const parsedId = parseProductRouteId(rawId.trim());
  return unstable_cache(
    () => fetchProductByIdUncached(parsedId),
    ["product-by-id", String(parsedId)],
    { revalidate: 120 },
  )();
});

export function productPayloadToShopProduct(
  p: ProductListPayload,
): ShopCatalogProduct {
  const tagNames: string[] = [];
  if (typeof p.special_tag_name === "string" && p.special_tag_name.trim()) {
    tagNames.push(p.special_tag_name.trim());
  }
  if (Array.isArray(p.tags)) {
    for (const t of p.tags) {
      if (typeof t?.name === "string" && t.name.trim()) {
        tagNames.push(t.name.trim());
      }
    }
  }

  const price = typeof p.price === "number" ? p.price : 0;
  const after = p.price_after_sale;
  const hasPriceAfterSale = after != null && typeof after === "number";
  const salePrice =
    hasPriceAfterSale && typeof p.price === "number" && after < p.price
      ? after
      : undefined;

  return {
    id: p.id ?? "",
    name: typeof p.title === "string" ? p.title : "",
    category: typeof p.category_name === "string" ? p.category_name : undefined,
    categoryId: p.category_id ?? null,
    price,
    salePrice,
    hasPriceAfterSale,
    specialTags: [...new Set(tagNames)],
    image: primaryProductImage(p.images),
    createdAt: typeof p.created_at === "string" ? p.created_at : undefined,
  };
}

export function productPayloadToDetail(
  p: ProductListPayload,
): ShopProductDetail {
  const base = productPayloadToShopProduct(p);
  const gallery = collectProductImages(p.images);
  const images = gallery.length > 0 ? gallery : [base.image || IMAGE_FALLBACK];
  const stock = typeof p.stock === "number" ? p.stock : 0;
  return {
    ...base,
    image: base.image || (images[0] ?? IMAGE_FALLBACK),
    description:
      typeof p.description === "string" && p.description.trim()
        ? p.description
        : null,
    stock,
    images,
  };
}
