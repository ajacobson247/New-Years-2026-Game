import TrackEvent from "@/components/TrackEvent";
import ClueInputField from "@/components/ClueInputField";

export default function Clue1() {
  function handleSubmit(answer: string) {
    console.log("Submitted answer:", answer);

    if (answer.trim().toLowerCase() === "under the lamp") {
      window.location.href = "/clue_3";
    } else {
      alert("Incorrect answer. Please try again.");
    }
  }
  
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-background font-sans text-foreground">
      <TrackEvent type="view_clue" clue="clue_1" />
      <h1 className="text-5xl font-serif tracking-wide text-center">
        Clue 1: The Journey Begins
      </h1>
      <h2 className="m-6 mt-12 text-2xl text-center">
        No sparks, no smoke, no flame in sight,<br/>
        Yet candle wax is hiding right.<br/>
        Where guests may rest and books all sleep,<br/>
        The next small clue is yours to keep.<br/>
      </h2>
      <ClueInputField onSubmit={handleSubmit} />
    </div>
  );
}
