"use server";

import { redirect } from "next/navigation";

import {
  ensurePlayerIdCookie,
  setPlayerNameCookie,
  setPlayerProgressCookie,
} from "@/lib/server/playerCookies";

type SetupState = { error?: string };

export async function setupTeam(_prev: SetupState, formData: FormData): Promise<SetupState> {
  const teamName = String(formData.get("teamName") ?? "").trim();
  if (!teamName) {
    return { error: "Please enter a team name." };
  }

  await ensurePlayerIdCookie();
  await setPlayerNameCookie(teamName);
  await setPlayerProgressCookie("/clue_1");

  redirect("/clue_1");
}
