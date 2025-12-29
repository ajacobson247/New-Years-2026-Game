export type ClueKey = `clue_${1 | 2 | 3 | 4 | 5 | 6}`;

export type ClueConfig = {
  clue: ClueKey;
  heading: string;
  bodyLines: string[];
  nextHref: string;
  showAnswerInput?: boolean;
};

type ClueRiddleOverride = {
  heading?: string;
  bodyLines?: string[] | string;
};

const DEFAULT_BODY_LINES = [
  "No sparks, no smoke, no flame in sight,",
  "Yet candle wax is hiding right.",
  "Where guests may rest and books all sleep,",
  "The next small clue is yours to keep.",
];

export const CLUES: Record<ClueKey, ClueConfig> = {
  clue_1: {
    clue: "clue_1",
    heading: "Clue 1: The Journey Begins",
    bodyLines: DEFAULT_BODY_LINES,
    nextHref: "/clue_2",
  },
  clue_2: {
    clue: "clue_2",
    heading: "Clue 2: The Journey Continues",
    bodyLines: DEFAULT_BODY_LINES,
    nextHref: "/clue_3",
  },
  clue_3: {
    clue: "clue_3",
    heading: "Clue 3",
    bodyLines: ["(Replace this text with your Clue 3 riddle.)"],
    nextHref: "/clue_4",
  },
  clue_4: {
    clue: "clue_4",
    heading: "Clue 4",
    bodyLines: ["(Replace this text with your Clue 4 riddle.)"],
    nextHref: "/clue_5",
  },
  clue_5: {
    clue: "clue_5",
    heading: "Clue 5",
    bodyLines: ["(Replace this text with your Clue 5 riddle.)"],
    nextHref: "/clue_6",
  },
  clue_6: {
    clue: "clue_6",
    heading: "Clue 6: The Final Clue",
    bodyLines: [
      "This is the final clue.",
      "The prize will be there.",
    ],
    nextHref: "/",
    showAnswerInput: false,
  },
};

function getRiddleOverrides(): Partial<Record<ClueKey, ClueRiddleOverride>> {
  const raw = process.env.CLUE_RIDDLES_JSON;
  if (!raw) return {};

  try {
    return JSON.parse(raw) as Partial<Record<ClueKey, ClueRiddleOverride>>;
  } catch {
    return {};
  }
}

function normalizeBodyLines(value: string[] | string | undefined): string[] | undefined {
  if (!value) return undefined;
  if (Array.isArray(value)) return value;

  const lines = value
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  return lines.length ? lines : undefined;
}

export function getClueConfig(clue: ClueKey): ClueConfig {
  const base = CLUES[clue];
  const overrides = getRiddleOverrides()[clue];

  const heading = overrides?.heading?.trim() ? overrides.heading.trim() : base.heading;
  const bodyLines = normalizeBodyLines(overrides?.bodyLines) ?? base.bodyLines;

  return {
    ...base,
    heading,
    bodyLines,
  };
}
