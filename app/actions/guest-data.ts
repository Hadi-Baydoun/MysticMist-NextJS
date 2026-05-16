"use server";

import {
  cartJoinToCartItem,
  normalizeProductId,
  wishlistJoinToItem,
} from "@/lib/guest-db-mapper";
import {
  getGuestSessionPair,
  persistGuestSessionIfNew,
} from "@/lib/guest-session-server";
import type { CartItem } from "@/lib/stores/cartStore";
import type { WishlistItem } from "@/lib/stores/wishlistStore";
import {
  createServiceRoleClient,
  isServiceRoleConfigured,
} from "@/lib/supabase/service-role";

const CONFIG_ERROR =
  "Missing Supabase env: NEXT_PUBLIC_SUPABASE_URL and a key (SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY).";

type Fail = { ok: false; error: string };
type OkWith<T extends Record<string, unknown>> = { ok: true } & T;
type OkEmpty = { ok: true };

function fail(error: string): Fail {
  return { ok: false, error };
}

type CartJoinRow = {
  quantity?: number;
  product_id?: unknown;
  products?: unknown;
};

type WishJoinRow = { product_id?: unknown; products?: unknown };

async function fetchGuestCartItemsForSession(
  sessionId: string,
): Promise<{ items: CartItem[] } | { error: string }> {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("guest_cart_items")
    .select(
      `
        quantity,
        product_id,
        products ( id, title, price, price_after_sale, images )
      `,
    )
    .eq("session_id", sessionId);

  if (error) return { error: error.message };

  const items = (data ?? [])
    .map((row) => cartJoinToCartItem(row as CartJoinRow))
    .filter((x): x is NonNullable<typeof x> => x != null);

  return { items };
}

async function fetchGuestWishlistItemsForSession(
  sessionId: string,
): Promise<{ items: WishlistItem[] } | { error: string }> {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("guest_wishlist_items")
    .select(
      `
        product_id,
        products ( id, title, price, price_after_sale, images )
      `,
    )
    .eq("session_id", sessionId);

  if (error) return { error: error.message };

  const items = (data ?? [])
    .map((row) => wishlistJoinToItem(row as WishJoinRow))
    .filter((x): x is NonNullable<typeof x> => x != null);

  return { items };
}

/** One Server Action: same guest session + cookie write as single load / add flows. */
export async function loadGuestCartAndWishlistAction(): Promise<
  | OkWith<{ cart: CartItem[]; wishlist: WishlistItem[] }>
  | Fail
> {
  if (!isServiceRoleConfigured()) return fail(CONFIG_ERROR);

  try {
    const { sessionId, isNew } = await getGuestSessionPair();
    const [cartRes, wishRes] = await Promise.all([
      fetchGuestCartItemsForSession(sessionId),
      fetchGuestWishlistItemsForSession(sessionId),
    ]);

    if ("error" in cartRes) return fail(cartRes.error);
    if ("error" in wishRes) return fail(wishRes.error);

    await persistGuestSessionIfNew(sessionId, isNew);
    return {
      ok: true,
      cart: cartRes.items,
      wishlist: wishRes.items,
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return fail(msg);
  }
}

// ─── Cart

export async function loadGuestCartAction(): Promise<
  OkWith<{ items: CartItem[] }> | Fail
> {
  if (!isServiceRoleConfigured()) return fail(CONFIG_ERROR);

  try {
    const { sessionId, isNew } = await getGuestSessionPair();
    const res = await fetchGuestCartItemsForSession(sessionId);
    if ("error" in res) return fail(res.error);

    await persistGuestSessionIfNew(sessionId, isNew);
    return { ok: true, items: res.items };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return fail(msg);
  }
}

export async function addToGuestCartAction(
  productId: string | number,
  quantity = 1,
): Promise<OkEmpty | Fail> {
  if (!isServiceRoleConfigured()) return fail(CONFIG_ERROR);

  const pid = normalizeProductId(productId);
  if (pid === "") return fail("productId required");

  const addQty =
    typeof quantity === "number" && quantity >= 1
      ? Math.floor(quantity)
      : Math.max(1, parseInt(String(quantity), 10) || 1);

  try {
    const { sessionId, isNew } = await getGuestSessionPair();
    const supabase = createServiceRoleClient();

    const { data: existing, error: readErr } = await supabase
      .from("guest_cart_items")
      .select("quantity")
      .eq("session_id", sessionId)
      .eq("product_id", pid)
      .maybeSingle();

    if (readErr) return fail(readErr.message);

    const nextQty =
      (typeof existing?.quantity === "number" ? existing.quantity : 0) + addQty;

    const { error } = await supabase.from("guest_cart_items").upsert(
      {
        session_id: sessionId,
        product_id: pid,
        quantity: nextQty,
      },
      { onConflict: "session_id,product_id" },
    );

    if (error) return fail(error.message);
    await persistGuestSessionIfNew(sessionId, isNew);
    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return fail(msg);
  }
}

export async function updateGuestCartQuantityAction(
  productId: string | number,
  quantity: number,
): Promise<OkEmpty | Fail> {
  if (!isServiceRoleConfigured()) return fail(CONFIG_ERROR);

  const pid = normalizeProductId(productId);
  if (pid === "") return fail("productId required");

  const q = parseInt(String(quantity), 10);

  try {
    const { sessionId, isNew } = await getGuestSessionPair();
    const supabase = createServiceRoleClient();

    if (!Number.isFinite(q) || q < 1) {
      const { error } = await supabase
        .from("guest_cart_items")
        .delete()
        .eq("session_id", sessionId)
        .eq("product_id", pid);

      if (error) return fail(error.message);
    } else {
      const { error } = await supabase
        .from("guest_cart_items")
        .update({ quantity: q })
        .eq("session_id", sessionId)
        .eq("product_id", pid);

      if (error) return fail(error.message);
    }

    await persistGuestSessionIfNew(sessionId, isNew);
    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return fail(msg);
  }
}

export async function removeGuestCartLineAction(
  productId: string | number,
): Promise<OkEmpty | Fail> {
  if (!isServiceRoleConfigured()) return fail(CONFIG_ERROR);

  const pid = normalizeProductId(productId);
  if (pid === "") return fail("productId required");

  try {
    const { sessionId, isNew } = await getGuestSessionPair();
    const supabase = createServiceRoleClient();

    const { error } = await supabase
      .from("guest_cart_items")
      .delete()
      .eq("session_id", sessionId)
      .eq("product_id", pid);

    if (error) return fail(error.message);
    await persistGuestSessionIfNew(sessionId, isNew);
    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return fail(msg);
  }
}

export async function clearGuestCartAction(): Promise<OkEmpty | Fail> {
  if (!isServiceRoleConfigured()) return fail(CONFIG_ERROR);

  try {
    const { sessionId, isNew } = await getGuestSessionPair();
    const supabase = createServiceRoleClient();

    const { error } = await supabase
      .from("guest_cart_items")
      .delete()
      .eq("session_id", sessionId);

    if (error) return fail(error.message);
    await persistGuestSessionIfNew(sessionId, isNew);
    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return fail(msg);
  }
}

// ─── Wishlist

export async function loadGuestWishlistAction(): Promise<
  OkWith<{ items: WishlistItem[] }> | Fail
> {
  if (!isServiceRoleConfigured()) return fail(CONFIG_ERROR);

  try {
    const { sessionId, isNew } = await getGuestSessionPair();
    const res = await fetchGuestWishlistItemsForSession(sessionId);
    if ("error" in res) return fail(res.error);

    await persistGuestSessionIfNew(sessionId, isNew);
    return { ok: true, items: res.items };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return fail(msg);
  }
}

export async function addGuestWishlistAction(
  productId: string | number,
): Promise<OkEmpty | Fail> {
  if (!isServiceRoleConfigured()) return fail(CONFIG_ERROR);

  const pid = normalizeProductId(productId);
  if (pid === "") return fail("productId required");

  try {
    const { sessionId, isNew } = await getGuestSessionPair();
    const supabase = createServiceRoleClient();

    const { error } = await supabase.from("guest_wishlist_items").insert({
      session_id: sessionId,
      product_id: pid,
    });

    if (error && error.code !== "23505") return fail(error.message);
    await persistGuestSessionIfNew(sessionId, isNew);
    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return fail(msg);
  }
}

export async function removeGuestWishlistAction(
  productId: string | number,
): Promise<OkEmpty | Fail> {
  if (!isServiceRoleConfigured()) return fail(CONFIG_ERROR);

  const pid = normalizeProductId(productId);
  if (pid === "") return fail("productId required");

  try {
    const { sessionId, isNew } = await getGuestSessionPair();
    const supabase = createServiceRoleClient();

    const { error } = await supabase
      .from("guest_wishlist_items")
      .delete()
      .eq("session_id", sessionId)
      .eq("product_id", pid);

    if (error) return fail(error.message);
    await persistGuestSessionIfNew(sessionId, isNew);
    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return fail(msg);
  }
}

/** One round-trip: increment cart line + remove from wishlist. */
export async function moveGuestWishlistToCartAction(
  productId: string | number,
): Promise<OkEmpty | Fail> {
  if (!isServiceRoleConfigured()) return fail(CONFIG_ERROR);

  const pid = normalizeProductId(productId);
  if (pid === "") return fail("productId required");

  try {
    const { sessionId, isNew } = await getGuestSessionPair();
    const supabase = createServiceRoleClient();

    const { data: existing, error: readErr } = await supabase
      .from("guest_cart_items")
      .select("quantity")
      .eq("session_id", sessionId)
      .eq("product_id", pid)
      .maybeSingle();

    if (readErr) return fail(readErr.message);

    const nextQty =
      (typeof existing?.quantity === "number" ? existing.quantity : 0) + 1;

    const { error: upsertErr } = await supabase.from("guest_cart_items").upsert(
      {
        session_id: sessionId,
        product_id: pid,
        quantity: nextQty,
      },
      { onConflict: "session_id,product_id" },
    );

    if (upsertErr) return fail(upsertErr.message);

    const { error: delErr } = await supabase
      .from("guest_wishlist_items")
      .delete()
      .eq("session_id", sessionId)
      .eq("product_id", pid);

    if (delErr) return fail(delErr.message);

    await persistGuestSessionIfNew(sessionId, isNew);
    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return fail(msg);
  }
}
