"use server";

import fs from "node:fs";
import path from "node:path";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { getSupabaseAnonServerClient } from "@/lib/supabase/anon-server";
import {
  ensurePlayerIdCookie,
  getPlayerNameFromCookies,
  setPlayerProgressCookie,
} from "@/lib/server/playerCookies";

type SubmitConfig = {
  clue: string;
  nextHref: string;
};

type SubmitState = {
  error?: string;
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

export async function submitClueAnswer(
  config: SubmitConfig,
  _prevState: SubmitState,
  formData: FormData
): Promise<SubmitState> {
  const expected = getExpectedAnswer(config.clue);
  if (!expected) {
    return { error: `No expected answer configured for ${config.clue}` };
  }

  const answer = String(formData.get("answer") ?? "");
  if (!answer.trim()) {
    return { error: "Enter an answer." };
  }

  const playerId = await ensurePlayerIdCookie();
  const playerName = await getPlayerNameFromCookies();

  const correct = normalizeAnswer(answer) === normalizeAnswer(String(expected));

  const headerBag = await headers();
  const userAgent = headerBag.get("user-agent") ?? null;

  const supabase = getSupabaseAnonServerClient();
  const { error } = await supabase.from("events").insert({
    type: "answer",
    clue: config.clue,
    player_id: playerId,
    player_name: playerName,
    user_agent: userAgent,
    is_correct: correct,
  });

  if (error) {
    return { error: `Failed to record answer: ${error.message}` };
  }

  if (!correct) {
    return { error: "Incorrect — try again." };
  }

  await setPlayerProgressCookie(config.nextHref);
  redirect(config.nextHref);
}
