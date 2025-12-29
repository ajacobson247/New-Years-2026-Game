import Link from "next/link";
import TrackEvent from "@/components/TrackEvent";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-background font-sans text-foreground">
      <TrackEvent type="view_home" />
      <h1 className="text-6xl font-serif tracking-wide text-center">Happy New Year 2026!</h1>
      <h2 className="m-6 mt-12 text-2xl text-center">
        Congratulations!
        You have discovered the first clue in our hidden game.<br/><br/>
        By accepting to play, you will receive a clue that will set you on a riddle filled journey.<br/><br/>
        <strong>BUT</strong>, it's important to try and keep the game a secret from others!<br/><br/>
        Ready to embark on this adventure? <br/><br/> Click <Link href="/setup" className="underline">here</Link> to begin!
      </h2>
    </div>
  );
}
