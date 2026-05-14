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
  specialTags: string[];
  image: string;
  createdAt?: string;
};

export type FetchProductsResult =
  | { ok: true; products: ProductListPayload[] }
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

/** Server-side product list for shop (same query as former route handler). */
export async function fetchProducts(): Promise<FetchProductsResult> {
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

export function productPayloadToShopProduct(p: ProductListPayload): ShopCatalogProduct {
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
  const salePrice =
    after != null &&
    typeof after === "number" &&
    typeof p.price === "number" &&
    after < p.price
      ? after
      : undefined;

  return {
    id: p.id ?? "",
    name: typeof p.title === "string" ? p.title : "",
    category: typeof p.category_name === "string" ? p.category_name : undefined,
    categoryId: p.category_id ?? null,
    price,
    salePrice,
    specialTags: [...new Set(tagNames)],
    image: primaryProductImage(p.images),
    createdAt: typeof p.created_at === "string" ? p.created_at : undefined,
  };
}
