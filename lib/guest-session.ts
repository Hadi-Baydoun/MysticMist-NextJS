import { randomUUID } from "crypto";

import type { NextResponse } from "next/server";

export const GUEST_SESSION_COOKIE = "guest_session_id";

const ONE_YEAR_SEC = 60 * 60 * 24 * 365;

export function guestSessionCookieOptions(sessionId: string) {
  return {
    name: GUEST_SESSION_COOKIE,
    value: sessionId,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: ONE_YEAR_SEC,
  };
}

export function ensureSessionId(existing: string | undefined): {
  sessionId: string;
  isNew: boolean;
} {
  if (existing && existing.trim()) {
    return { sessionId: existing.trim(), isNew: false };
  }
  return { sessionId: randomUUID(), isNew: true };
}

export function applyGuestSessionCookie(
  res: NextResponse,
  sessionId: string,
  isNew: boolean,
) {
  if (isNew) {
    res.cookies.set(guestSessionCookieOptions(sessionId));
  }
}
