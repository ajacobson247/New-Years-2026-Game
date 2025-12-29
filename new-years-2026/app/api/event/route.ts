import { NextResponse } from "next/server";
import { headers } from "next/headers";

import { getSupabaseAnonServerClient } from "@/lib/supabase/anon-server";
import { ensurePlayerIdCookie, getPlayerNameFromCookies } from "@/lib/server/playerCookies";

type EventType = "view_home" | "view_clue" | "finish";

type EventPayload = {
  type: EventType;
  clue?: string;
  playerId?: string;
  playerName?: string;
};

export async function POST(request: Request) {
  let payload: EventPayload;

  try {
    payload = (await request.json()) as EventPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!payload?.type) {
    return NextResponse.json({ error: "Missing type" }, { status: 400 });
  }

  const cookiePlayerId = await ensurePlayerIdCookie();
  const cookiePlayerName = await getPlayerNameFromCookies();
  const playerId = cookiePlayerId ?? payload.playerId ?? null;
  const playerName = cookiePlayerName ?? payload.playerName?.trim() ?? null;

  const headerBag = await headers();
  const userAgent = headerBag.get("user-agent") ?? null;

  const supabase = getSupabaseAnonServerClient();

  if (playerId) {
    const { error } = await supabase.from("events").insert({
      type: payload.type,
      clue: payload.clue ?? null,
      player_id: playerId,
      player_name: playerName,
      user_agent: userAgent,
    });

    if (error) {
      return NextResponse.json(
        { error: "Insert failed", details: error.message },
        { status: 500 }
      );
    }
  }
  
  return NextResponse.json({ ok: true });
}
