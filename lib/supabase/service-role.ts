import { createClient, type SupabaseClient } from "@supabase/supabase-js";

type Cached = { url: string; key: string; client: SupabaseClient };

let cached: Cached | null = null;

/**
 * Server-side Supabase client for guest cart / wishlist Server Actions.
 *
 * Prefers `SUPABASE_SERVICE_ROLE_KEY` (bypasses RLS — recommended).
 * If unset, falls back to `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` so open RLS
 * on `guest_*` tables works without the service key.
 */
export function createServiceRoleClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();

  if (!url) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
  }

  const key = serviceKey || anonKey;
  if (!key) {
    throw new Error(
      "Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
    );
  }

  if (cached?.url === url && cached?.key === key) {
    return cached.client;
  }

  if (!serviceKey && anonKey && process.env.NODE_ENV === "development") {
    console.warn(
      "[mysticnext] Guest data actions: SUPABASE_SERVICE_ROLE_KEY is not set; using NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY. " +
        "Ensure RLS on guest_cart_items / guest_wishlist_items allows what you need, and that anon can read `products` for cart joins. Prefer the service role in production.",
    );
  }

  const client = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  cached = { url, key, client };
  return client;
}

export function isServiceRoleConfigured(): boolean {
  const url = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL?.trim());
  const key = Boolean(
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ||
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim(),
  );
  return url && key;
}
