import TrackEvent from "@/components/TrackEvent";

export default function Clue1() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-background font-sans text-foreground">
      <TrackEvent type="view_clue" clue="clue_1" />
      <h1 className="text-5xl font-serif tracking-wide text-center">
        Clue 1: The Journey Begins
      </h1>
      <h2 className="m-6 mt-12 text-2xl text-center">
        Insert clue content here...
      </h2>
    </div>
  );
}
