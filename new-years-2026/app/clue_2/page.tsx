import TrackEvent from "@/components/TrackEvent";
import ClueInputField from "@/components/ClueInputField";
import { submitClueAnswer } from "@/lib/actions/submitClueAnswer";

export default function Clue2() {
  const action = submitClueAnswer.bind(null, {
    clue: "clue_2",
    nextHref: "/clue_3",
  });
  
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-background font-sans text-foreground">
      <TrackEvent type="view_clue" clue="clue_2" />
      <h1 className="text-5xl font-serif tracking-wide text-center">
        Clue 2: The Journey Continues
      </h1>
      <h2 className="m-6 mt-12 text-2xl text-center">
        No sparks, no smoke, no flame in sight,<br/>
        Yet candle wax is hiding right.<br/>
        Where guests may rest and books all sleep,<br/>
        The next small clue is yours to keep.<br/>
      </h2>
        <ClueInputField action={action} />
    </div>
  );
}
