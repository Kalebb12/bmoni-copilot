// Extracts a spoken PIN from a Whisper transcript. Numeric speech-to-text is
// the weakest link in a voice-only PIN flow: Whisper may transcribe "one two
// three four" as words or as digits depending on phrasing, so both are
// handled. Callers must still validate the result length themselves and
// re-prompt rather than guess.
const WORD_TO_DIGIT: Record<string, string> = {
  zero: '0',
  oh: '0',
  one: '1',
  two: '2',
  to: '2',
  too: '2',
  three: '3',
  four: '4',
  for: '4',
  five: '5',
  six: '6',
  seven: '7',
  eight: '8',
  ate: '8',
  nine: '9',
};

export function extractDigitsFromTranscript(transcript: string): string {
  const words = transcript
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);

  return words.map((word) => (/^\d$/.test(word) ? word : WORD_TO_DIGIT[word] ?? '')).join('');
}

export function isValidPinLength(digits: string, pinLength: number): boolean {
  return new RegExp(`^\\d{${pinLength}}$`).test(digits);
}
