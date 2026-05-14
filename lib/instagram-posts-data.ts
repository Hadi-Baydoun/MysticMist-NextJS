import { createClient } from "@supabase/supabase-js";

type InstagramPostRow = {
  id?: string;
  link?: string;
  image?: string;
};

export const INSTAGRAM_PROFILE = "https://instagram.com/mystic.mist.lb";

export type InstagramPost = {
  id: string | number;
  link: string;
  image: string | null;
};

export type FetchInstagramPostsResult =
  | { ok: true; instagram_posts: InstagramPost[] }
  | { ok: false; error: string };

function rowToPost(row: InstagramPostRow, index: number): InstagramPost {
  const link =
    typeof row.link === "string" && row.link.trim()
      ? row.link.trim()
      : INSTAGRAM_PROFILE;

  const image =
    typeof row.image === "string" && row.image.trim()
      ? row.image.trim()
      : null;

  return {
    id: row.id ?? index,
    link,
    image,
  };
}

/** Server-side load for recent Instagram tiles (`instagram_posts` table). */
export async function fetchInstagramPosts(): Promise<FetchInstagramPostsResult> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    return { ok: false, error: "Missing Supabase configuration" };
  }

  const supabase = createClient(url, key);
  const { data, error } = await supabase
    .from("instagram_posts")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(6);

  if (error) {
    return { ok: false, error: error.message };
  }

  const rows = (data ?? []) as InstagramPostRow[];
  const instagram_posts = rows.map(rowToPost);

  return { ok: true, instagram_posts };
}
