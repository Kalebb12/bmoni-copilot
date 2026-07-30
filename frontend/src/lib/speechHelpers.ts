// Small heuristics for parsing spoken replies mid-flow (yes/no, picking a
// contact out of a candidate list, matching a spoken bank name). Kept as
// plain substring/normalization matching rather than a fuzzy-match
// dependency — good enough for a hackathon demo, and mirrors the backend's
// own "simple, not overbuilt" bar.
const YES_WORDS = ['yes', 'yeah', 'yep', 'yup', 'sure', 'okay', 'ok', 'correct', 'confirm', 'affirmative', 'alright', 'go ahead'];
const NO_WORDS = ['no', 'nope', 'nah', 'cancel', 'stop', "don't", 'do not', 'negative'];

function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s']/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function isAffirmative(transcript: string): boolean {
  const norm = ` ${normalize(transcript)} `;
  return YES_WORDS.some((word) => norm.includes(` ${word} `));
}

export function isNegative(transcript: string): boolean {
  const norm = ` ${normalize(transcript)} `;
  return NO_WORDS.some((word) => norm.includes(` ${word} `));
}

export function findBestNameMatch<T extends { display_name: string }>(spoken: string, candidates: T[]): T | null {
  const norm = normalize(spoken);
  if (!norm) return null;
  let best: T | null = null;
  let bestScore = 0;
  for (const candidate of candidates) {
    const label = normalize(candidate.display_name);
    if (!label) continue;
    if (norm.includes(label) || label.includes(norm)) {
      if (label.length > bestScore) {
        bestScore = label.length;
        best = candidate;
      }
    }
  }
  return best;
}

export function findBankByName<T extends { name: string }>(spoken: string, banks: T[]): T | null {
  const norm = normalize(spoken);
  if (!norm) return null;
  let best: T | null = null;
  let bestScore = 0;
  for (const bank of banks) {
    const label = normalize(bank.name);
    if (!label) continue;
    if (norm.includes(label) || label.includes(norm)) {
      if (label.length > bestScore) {
        bestScore = label.length;
        best = bank;
      }
    }
  }
  return best;
}
