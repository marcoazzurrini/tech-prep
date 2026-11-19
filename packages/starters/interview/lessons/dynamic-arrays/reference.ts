export function firstAndLastLetters(words: string[]): string[] {
  const ends: string[] = [];
  for (const word of words) {
    // Index 0 is the first letter. Index length - 1 is the last one.
    ends.push(word[0] + word[word.length - 1]);
  }
  return ends;
}
