import "server-only";

import { cookies } from "next/headers";

const PLAYER_ID_COOKIE = "ny26_player_id";
const PLAYER_NAME_COOKIE = "ny26_player_name";

export async function getPlayerIdFromCookies() {
  const cookieStore = await cookies();
  return cookieStore.get(PLAYER_ID_COOKIE)?.value || null;
}

export async function ensurePlayerIdCookie() {
  const cookieStore = await cookies();
  const existingId = cookieStore.get(PLAYER_ID_COOKIE)?.value;
  const playerId = existingId || crypto.randomUUID();

  if (!existingId) {
    const secure = process.env.NODE_ENV === "production";
    cookieStore.set(PLAYER_ID_COOKIE, playerId, {
      httpOnly: true,
      sameSite: "lax",
      secure,
      path: "/",
      maxAge: 60 * 60 * 8,
    });
  }

  return playerId;
}

export async function getPlayerNameFromCookies() {
  const cookieStore = await cookies();
  const raw = cookieStore.get(PLAYER_NAME_COOKIE)?.value ?? "";
  const value = raw.trim();
  return value ? value : null;
}

export async function setPlayerNameCookie(name: string) {
  const cookieStore = await cookies();
  const trimmed = name.trim();
  if (!trimmed) return;

  const secure = process.env.NODE_ENV === "production";
  cookieStore.set(PLAYER_NAME_COOKIE, trimmed.slice(0, 64), {
    httpOnly: true,
    sameSite: "lax",
    secure,
    path: "/",
    maxAge: 60 * 60 * 8,
  });
}
