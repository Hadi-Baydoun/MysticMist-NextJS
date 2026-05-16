import { cookies } from "next/headers";

import {
  ensureSessionId,
  GUEST_SESSION_COOKIE,
  guestSessionCookieOptions,
} from "@/lib/guest-session";

export async function getGuestSessionPair() {
  const cookieStore = await cookies();
  return ensureSessionId(cookieStore.get(GUEST_SESSION_COOKIE)?.value);
}

export async function persistGuestSessionIfNew(
  sessionId: string,
  isNew: boolean,
) {
  if (!isNew) return;
  const cookieStore = await cookies();
  const opts = guestSessionCookieOptions(sessionId);
  cookieStore.set(opts.name, opts.value, {
    httpOnly: opts.httpOnly,
    secure: opts.secure,
    sameSite: opts.sameSite,
    path: opts.path,
    maxAge: opts.maxAge,
  });
}
