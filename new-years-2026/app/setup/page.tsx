import SetupForm from "@/components/SetupForm";
import { setupTeam } from "@/lib/actions/setupTeam";

export default function SetupPage() {

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-background font-sans text-foreground">
      <h1 className="pt-12 text-5xl font-serif tracking-wide text-center">
        Before You Begin
      </h1>
      <h2 className="m-6 mb-12 mt-12 text-2xl text-center">
        A couple of things before we start the game.<br/><br/>
        First, there is no need to open any drawers, cabinets, or other private areas in search of clues.<br/><br/>
        All objects will be accessible and in plain sight.<br/><br/>
        Second, enter your team name so we can track your progress.
      </h2>
      <SetupForm action={setupTeam} />
    </div>
  );
}