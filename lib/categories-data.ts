import { unstable_cache } from "next/cache";

import { createClient } from "@supabase/supabase-js";

type CategoryRow = {
  id?: string | number;
  title?: string | null;
  name?: string | null;
  image?: string | null;
};

/** Resolved tile for homepage “Shop by Category” (linked to `/shop?category=`). */
export type ShopCategoryTile = {
  id: string | number;
  name: string;
  image: string | null;
};

export type FetchCategoriesResult =
  | { ok: true; categories: ShopCategoryTile[] }
  | { ok: false; error: string };

export function coverImageFromTitle(
  title: string,
  remoteFallback: string | null,
): string | null {
  const t = title.toLowerCase().trim();

  if (t === "sets" || t.includes("sets")) return "/category/sets.jpg";

  if (t === "mists" || t.includes("mist")) return "/category/mists.jpg";

  if (t === "lotions" || t.includes("lotion")) return "/category/lotions.jpg";

  return remoteFallback;
}

function rowToTile(row: CategoryRow): ShopCategoryTile {
  const title =
    (typeof row.title === "string" && row.title) ||
    (typeof row.name === "string" && row.name) ||
    "Untitled";

  const name = title.trim() || "Untitled";

  const remoteFallback =
    typeof row.image === "string" && row.image.trim()
      ? row.image.trim()
      : null;

  return {
    id: row.id ?? name,
    name,
    image: coverImageFromTitle(name, remoteFallback),
  };
}

async function fetchCategoriesUncached(): Promise<FetchCategoriesResult> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    return { ok: false, error: "Missing Supabase configuration" };
  }

  const supabase = createClient(url, key);
  const { data, error } = await supabase.from("category").select("*");

  if (error) {
    return { ok: false, error: error.message };
  }

  const rows = (data ?? []) as CategoryRow[];
  const categories = rows.map(rowToTile);

  return { ok: true, categories };
}

/** Server-side load for `category` table (homepage + shop filters); cached briefly. */
export async function fetchCategories(): Promise<FetchCategoriesResult> {
  return unstable_cache(
    fetchCategoriesUncached,
    ["category-tiles"],
    { revalidate: 120 },
  )();
}
