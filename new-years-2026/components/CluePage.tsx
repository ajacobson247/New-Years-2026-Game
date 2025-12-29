import TrackEvent from "@/components/TrackEvent";
import ClueInputField from "@/components/ClueInputField";
import { submitClueAnswer } from "@/lib/actions/submitClueAnswer";
import type { ClueConfig } from "@/lib/clues";

export default function CluePage({ config }: { config: ClueConfig }) {
  const showAnswerInput = config.showAnswerInput !== false;
  const action = showAnswerInput
    ? submitClueAnswer.bind(null, {
        clue: config.clue,
        nextHref: config.nextHref,
      })
    : undefined;

  return (
    <div className="flex h-svh flex-col items-center justify-start overflow-hidden bg-background px-4 py-6 font-sans text-foreground">
      <TrackEvent type="view_clue" clue={config.clue} />
      <h1 className="text-center font-serif text-3xl leading-tight tracking-wide sm:text-5xl">
        {config.heading}
      </h1>

      <div className="mt-4 w-full max-w-md flex-1 overflow-auto text-center text-base leading-snug sm:text-2xl">
        {config.bodyLines.map((line, index) => (
          <p key={index} className="mb-2 last:mb-0">
            {line}
          </p>
        ))}
      </div>

      <div className="w-full max-w-md shrink-0">
        {showAnswerInput && action ? <ClueInputField action={action} /> : null}
      </div>
    </div>
  );
}
