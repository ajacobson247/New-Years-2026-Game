import Link from "next/link";
import SetupForm from "@/components/SetupForm";
import { setupTeam } from "@/lib/actions/setupTeam";
import {
  getPlayerNameFromCookies,
  getPlayerProgressFromCookies,
} from "@/lib/server/playerCookies";

export default async function SetupPage() {
  const teamName = await getPlayerNameFromCookies();
  const progressPath = await getPlayerProgressFromCookies();

  const resumeHref =
    progressPath && progressPath !== "/" && progressPath !== "/setup"
      ? progressPath
      : null;

  return (
    <div className="flex h-svh flex-col overflow-hidden bg-background px-2 py-3 font-sans text-foreground">
      <div className="flex flex-1 items-center justify-center overflow-hidden">
        <div className="flex w-full flex-col items-center overflow-hidden">
          <h1 className="text-center font-serif text-4xl tracking-wide sm:text-5xl">
            Before You Begin
          </h1>

          {resumeHref ? (
            <p className="mt-3 text-center text-base sm:text-xl">
              {teamName ? (
                <>
                  Current team: <strong>{teamName}</strong>. 
                </>
              ) : null}
              Already started? Resume <Link href={resumeHref} className="underline">here</Link>.
            </p>
          ) : null}

          <div className="mt-4 w-full max-h-[40svh] overflow-auto text-center text-base leading-snug sm:text-2xl">
            <p className="mb-3">A couple of things before we start the game.</p>
            <p className="mb-3">
              All clues are marked with <strong>gold stars</strong> and are out in the open — there’s no need to open drawers, cabinets, or other private areas in search of clues.
            </p>
            <p className="mb-3">
              The only exception is the <strong>final clue</strong>, which will require you to open something.
            </p>
            <p className="mb-3">
              To move forward, type a <strong>one-word</strong> answer to each riddle to unlock the next clue. Capitalization does not matter, but spelling correctly does.
            </p>
            <p>Enter your name so we can track your progress.</p>
          </div>

          <div className="mt-4 w-full">
            <SetupForm action={setupTeam} />
          </div>
        </div>
      </div>
    </div>
  );
}