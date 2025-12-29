"use client";

import { useEffect } from "react";

type TrackEventProps = {
  type: "view_home" | "view_clue" | "finish";
  clue?: string;
};

export default function TrackEvent({ type, clue }: TrackEventProps) {
  useEffect(() => {
    fetch("/api/event", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type,
        clue,
      }),
    }).catch(() => {
      // Best-effort analytics: ignore failures
    });
  }, [type, clue]);

  return null;
}
