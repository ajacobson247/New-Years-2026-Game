import { NextResponse } from "next/server";
import { headers } from "next/headers";
import fs from "node:fs";
import path from "node:path";

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

function stripWrappingQuotes(value: string): string {
  const trimmed = value.trim();
  const first = trimmed[0];
  const last = trimmed[trimmed.length - 1];
  if ((first === '"' && last === '"') || (first === "'" && last === "'")) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function extractQuotedEnvBlock(fileText: string, key: string): string | undefined {
  const patterns = [
    new RegExp(`${key}\\s*=\\s*'([\\s\\S]*?)'\\s*(?:\\r?\\n|$)`),
    new RegExp(`${key}\\s*=\\s*\"([\\s\\S]*?)\"\\s*(?:\\r?\\n|$)`),
  ];

  for (const pattern of patterns) {
    const match = fileText.match(pattern);
    if (match?.[1]) return match[1];
  }

  return undefined;
}

function readEnvJsonFromDotenvFile(key: string): string | undefined {
  try {
    const envPath = path.join(process.cwd(), ".env.local");
    const text = fs.readFileSync(envPath, "utf8");
    const extracted = extractQuotedEnvBlock(text, key);
    return extracted?.trim() ? extracted : undefined;
  } catch {
    return undefined;
  }
}

function parseJsonOrUndefined<T>(raw: string | undefined): T | undefined {
  if (!raw?.trim()) return undefined;

  try {
    return JSON.parse(raw) as T;
  } catch {
    try {
      return JSON.parse(stripWrappingQuotes(raw)) as T;
    } catch {
      return undefined;
    }
  }
}

function getExpectedAnswer(clue: string) {
  const fromEnv = parseJsonOrUndefined<Record<string, string>>(
    process.env.CLUE_ANSWERS_JSON
  );
  const map =
    fromEnv ??
    parseJsonOrUndefined<Record<string, string>>(
      readEnvJsonFromDotenvFile("CLUE_ANSWERS_JSON")
    );
  return map?.[clue];
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
