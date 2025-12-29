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
    <div className="flex h-svh flex-col items-center justify-start overflow-hidden bg-background px-4 py-6 font-sans text-foreground">
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
          Already started? Resume <a href={resumeHref} className="underline">here</a>.
        </p>
      ) : null}

      <div className="mt-4 w-full max-w-md flex-1 overflow-auto text-center text-base leading-snug sm:text-2xl">
        <p className="mb-3">A couple of things before we start the game.</p>
        <p className="mb-3">
          First, there is no need to open any drawers, cabinets, or other private areas in search of clues.
        </p>
        <p className="mb-3">All objects will be accessible and in plain sight.</p>
        <p>Second, enter your team name so we can track your progress.</p>
      </div>

      <div className="w-full max-w-md shrink-0">
        <SetupForm action={setupTeam} />
      </div>
    </div>
  );
}