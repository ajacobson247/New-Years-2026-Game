"use client";

import { useEffect } from "react";

type TrackEventProps = {
  type: "view_home" | "view_clue" | "finish";
  clue?: string;
};

function getOrCreatePlayerId() {
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

export default function TrackEvent({ type, clue }: TrackEventProps) {
  useEffect(() => {
    const playerId = getOrCreatePlayerId();

    fetch("/api/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type,
        clue,
        playerId,
      }),
    }).catch(() => {
      // Best-effort analytics: ignore failures
    });
  }, [type, clue]);

  return null;
}
