"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { getSupabaseAnonServerClient } from "@/lib/supabase/anon-server";
import { ensurePlayerIdCookie, getPlayerNameFromCookies } from "@/lib/server/playerCookies";

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

  redirect(config.nextHref);
}
