import Link from "next/link";
import TrackEvent from "@/components/TrackEvent";
import {
  getPlayerNameFromCookies,
  getPlayerProgressFromCookies,
} from "@/lib/server/playerCookies";

export default async function Home() {
  const teamName = await getPlayerNameFromCookies();
  const progressPath = await getPlayerProgressFromCookies();

  const resumeHref =
    progressPath && progressPath !== "/" && progressPath !== "/setup"
      ? progressPath
      : null;

  const clueMatch = resumeHref?.match(/^\/clue_(\d+)$/);
  const clueNumber = clueMatch ? Number(clueMatch[1]) : null;
  const resumeLabel = clueNumber ? `Clue ${clueNumber}` : null;

  return (
    <div className="flex h-svh flex-col overflow-hidden bg-background px-2 py-3 font-sans text-foreground">
      <TrackEvent type="view_home" />
      <div className="flex flex-1 items-center justify-center overflow-hidden">
        <div className="flex w-full flex-col items-center overflow-hidden">
          <h1 className="text-center font-serif font-semibold text-4xl tracking-wide drop-shadow-md text-6xl">
            Happy New Year 2026! 
          </h1>
          <h2 className="text-center font-serif py-6 text-2xl tracking-wide text-3xl">Shh... A secret game is going on.</h2>
          <div className="mt-4 w-full max-h-[46svh] overflow-auto text-center text-lg leading-snug text-3xl">
            <p className="mb-3">
              Congratulations! You have discovered our hidden game.
            </p>
            <p className="mb-3">
              By accepting to play, you’ll receive your first clue — there are <strong>6 clues</strong> in the game total.
            </p>
            <p className="mb-6">
              The first <strong>4</strong> teams to finish and arrive back win prizes. Everyone after that will receive a consolation prize.
            </p>
            <p className="mb-6">
              <strong>BUT</strong>, it’s important to try and keep the game a secret from others!
            </p>
            {resumeHref ? (
              <>
                {teamName ? (
                  <p className="mb-3">
                    Welcome back, <strong>{teamName}</strong>.
                  </p>
                ) : null}
                <p className="mb-3">
                  {resumeLabel ? (
                    <>
                      You’re currently on <strong>{resumeLabel}</strong>.
                    </>
                  ) : (
                    <>Looks like you were mid-game.</>
                  )}
                </p>
                <p className="mb-3">
                  Click <Link href={resumeHref} className="underline">here</Link> to resume.
                </p>
                <p>
                  Or click <Link href="/setup" className="underline">here</Link> to change name.
                </p>
              </>
            ) : (
              <p>
                Ready to embark on this adventure? Click <Link href="/setup" className="underline">here</Link> to begin!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
