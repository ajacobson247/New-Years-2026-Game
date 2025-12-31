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
        <div className="flex w-full flex-col items-center overflow-hidden">
          <h1 className="text-center font-serif font-semibold text-3xl leading-tight tracking-wide sm:text-5xl">
            {config.heading}
          </h1>

          <div className="mt-4 w-full max-h-[46svh] overflow-auto text-center text-base text-muted font-semibold leading-snug sm:text-3xl">
            {config.bodyLines.map((line, index) => (
              <p key={index} className="mb-2 last:mb-0">
                {line}
              </p>
            ))}
          </div>

          {config.question ? (
            <p className="mt-6 mb-4 text-center text-base italic sm:text-3xl">
              {config.question}
            </p>
          ) : null}
          {showAnswerInput && action ? (
            <div className="w-full">
              <ClueInputField action={action} />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
