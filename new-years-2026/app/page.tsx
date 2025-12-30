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
    <div className="flex h-svh flex-col overflow-hidden bg-background px-4 py-6 font-sans text-foreground">
      <TrackEvent type="view_home" />

      <div className="flex flex-1 items-center justify-center overflow-hidden">
        <div className="flex w-full max-w-md flex-col items-center overflow-hidden">
          <h1 className="text-center font-serif text-4xl tracking-wide sm:text-6xl">
            Happy New Year 2026!
          </h1>

          <div className="mt-4 w-full max-h-[46svh] overflow-auto text-center text-base leading-snug sm:text-2xl">
            <p className="mb-3">
              Congratulations! You have discovered the first clue in our hidden game.
            </p>
            <p className="mb-3">
              By accepting to play, you will receive a clue that will set you on a riddle-filled journey.
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
                  Or click <Link href="/setup" className="underline">here</Link> to change team name.
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
