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
    <div className="flex h-svh flex-col overflow-hidden bg-background px-4 py-6 font-sans text-foreground">
      <TrackEvent type="view_clue" clue={config.clue} />

      <div className="flex flex-1 items-center justify-center overflow-hidden">
        <div className="flex w-full max-w-md flex-col items-center overflow-hidden">
          <h1 className="text-center font-serif text-3xl leading-tight tracking-wide sm:text-5xl">
            {config.heading}
          </h1>

          <div className="mt-4 w-full max-h-[46svh] overflow-auto text-center text-base leading-snug sm:text-2xl">
            {config.bodyLines.map((line, index) => (
              <p key={index} className="mb-2 last:mb-0">
                {line}
              </p>
            ))}
          </div>

          {showAnswerInput && action ? (
            <div className="mt-4 w-full">
              <ClueInputField action={action} />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
