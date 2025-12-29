"use client";

export function getOrCreatePlayerId() {
  const key = "ny26_player_id";

  try {
    const existing = localStorage.getItem(key);
    if (existing) return existing;

    const created = crypto.randomUUID();
    localStorage.setItem(key, created);
    return created;
  } catch {
    return undefined;
  }
}
