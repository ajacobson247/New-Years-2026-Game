import fs from "node:fs";
import path from "node:path";

export type ClueKey = `clue_${1 | 2 | 3 | 4 | 5 | 6}`;

export type ClueConfig = {
  clue: ClueKey;
  heading: string;
  bodyLines: string[];
  question?: string;
  nextHref: string;
  showAnswerInput?: boolean;
};

type ClueRiddleOverride = {
  heading?: string;
  bodyLines?: string[] | string;
  question?: string;
};

function normalizeText(value: string | undefined): string | undefined {
  const normalized = value?.trim();
  return normalized ? normalized : undefined;
}

function stripWrappingQuotes(value: string): string {
  const trimmed = value.trim();
  const first = trimmed[0];
  const last = trimmed[trimmed.length - 1];
  if ((first === '"' && last === '"') || (first === "'" && last === "'")) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function extractQuotedEnvBlock(fileText: string, key: string): string | undefined {
  const patterns = [
    new RegExp(`${key}\\s*=\\s*'([\\s\\S]*?)'\\s*(?:\\r?\\n|$)`),
    new RegExp(`${key}\\s*=\\s*\"([\\s\\S]*?)\"\\s*(?:\\r?\\n|$)`),
  ];

  for (const pattern of patterns) {
    const match = fileText.match(pattern);
    if (match?.[1]) return match[1];
  }

  return undefined;
}

function readEnvJsonFromDotenvFile(key: string): string | undefined {
  try {
    const envPath = path.join(process.cwd(), ".env.local");
    const text = fs.readFileSync(envPath, "utf8");
    const extracted = extractQuotedEnvBlock(text, key);
    return extracted?.trim() ? extracted : undefined;
  } catch {
    return undefined;
  }
}

function parseJsonOrUndefined<T>(raw: string | undefined): T | undefined {
  if (!raw?.trim()) return undefined;

  try {
    return JSON.parse(raw) as T;
  } catch {
    try {
      return JSON.parse(stripWrappingQuotes(raw)) as T;
    } catch {
      return undefined;
    }
  }
}

const DEFAULT_BODY_LINES = [
  "(Riddle not configured yet.)",
  "Ask the host for help.",
];

export const CLUES: Record<ClueKey, ClueConfig> = {
  clue_1: {
    clue: "clue_1",
    heading: "Clue 1",
    bodyLines: DEFAULT_BODY_LINES,
    nextHref: "/clue_2",
  },
  clue_2: {
    clue: "clue_2",
    heading: "Clue 2",
    bodyLines: DEFAULT_BODY_LINES,
    nextHref: "/clue_3",
  },
  clue_3: {
    clue: "clue_3",
    heading: "Clue 3",
    bodyLines: DEFAULT_BODY_LINES,
    nextHref: "/clue_4",
  },
  clue_4: {
    clue: "clue_4",
    heading: "Clue 4",
    bodyLines: DEFAULT_BODY_LINES,
    nextHref: "/clue_5",
  },
  clue_5: {
    clue: "clue_5",
    heading: "Clue 5",
    bodyLines: DEFAULT_BODY_LINES,
    nextHref: "/clue_6",
  },
  clue_6: {
    clue: "clue_6",
    heading: "Clue 6",
    bodyLines: ["This is the final clue."],
    nextHref: "/",
    showAnswerInput: false,
  },
};

function getRiddleOverrides(): Partial<Record<ClueKey, ClueRiddleOverride>> {
  const fromEnv = parseJsonOrUndefined<Partial<Record<ClueKey, ClueRiddleOverride>>>(
    process.env.CLUE_RIDDLES_JSON
  );
  if (fromEnv) return fromEnv;

  const fromFile = parseJsonOrUndefined<Partial<Record<ClueKey, ClueRiddleOverride>>>(
    readEnvJsonFromDotenvFile("CLUE_RIDDLES_JSON")
  );

  return fromFile ?? {};
}

function normalizeBodyLines(
  value: string[] | string | undefined
): string[] | undefined {
  if (!value) return undefined;
  if (Array.isArray(value)) return value;

  const lines = value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return lines.length ? lines : undefined;
}

export function getClueConfig(clue: ClueKey): ClueConfig {
  const base = CLUES[clue];
  const overrides = getRiddleOverrides()[clue];

  const heading = overrides?.heading?.trim()
    ? overrides.heading.trim()
    : base.heading;
  const bodyLines = normalizeBodyLines(overrides?.bodyLines) ?? base.bodyLines;
  const question = normalizeText(overrides?.question);

  return {
    ...base,
    heading,
    bodyLines,
    question,
  };
}
