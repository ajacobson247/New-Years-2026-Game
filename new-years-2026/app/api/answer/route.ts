import { NextResponse } from "next/server";
import { headers } from "next/headers";

import { getSupabaseAnonServerClient } from "@/lib/supabase/anon-server";

type AnswerPayload = {
  clue: string;
  answer: string;
  playerId?: string;
  playerName?: string;
};

function normalizeAnswer(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function getExpectedAnswer(clue: string) {
  const raw = process.env.CLUE_ANSWERS_JSON;
  if (!raw) return undefined;

  try {
    const map = JSON.parse(raw) as Record<string, string>;
    return map[clue];
  } catch {
    return undefined;
  }
}

export async function POST(request: Request) {
  let payload: AnswerPayload;

  try {
    payload = (await request.json()) as AnswerPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!payload?.clue) {
    return NextResponse.json({ error: "Missing clue" }, { status: 400 });
  }

  if (typeof payload.answer !== "string") {
    return NextResponse.json({ error: "Missing answer" }, { status: 400 });
  }

  const expected = getExpectedAnswer(payload.clue);
  if (!expected) {
    return NextResponse.json(
      { error: `No expected answer configured for ${payload.clue}` },
      { status: 500 }
    );
  }

  const correct =
    normalizeAnswer(payload.answer) === normalizeAnswer(String(expected));

  const headerBag = await headers();
  const userAgent = headerBag.get("user-agent") ?? null;

  const supabase = getSupabaseAnonServerClient();

  const { error } = await supabase.from("events").insert({
    type: "answer",
    clue: payload.clue,
    player_id: payload.playerId ?? null,
    player_name: payload.playerName ?? null,
    user_agent: userAgent,
    is_correct: correct,
  });

  if (error) {
    return NextResponse.json(
      { error: "Insert failed", details: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ correct });
}
