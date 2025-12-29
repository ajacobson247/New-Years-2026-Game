"use client";

import { useEffect } from "react";

import { getOrCreatePlayerId } from "@/lib/client/player";

type TrackEventProps = {
  type: "view_home" | "view_clue" | "finish";
  clue?: string;
};

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
