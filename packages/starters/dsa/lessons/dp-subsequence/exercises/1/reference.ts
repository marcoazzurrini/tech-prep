export function longestLetterChain(words: string[]): number {
  // best[i] = longest chain that ends with words[i].
  const best = new Array<number>(words.length).fill(1);
  for (let i = 0; i < words.length; i++) {
    for (let j = 0; j < i; j++) {
      // words[j] can come just before words[i] when the letters match.
      if (words[j][words[j].length - 1] === words[i][0]) {
        best[i] = Math.max(best[i], best[j] + 1);
      }
    }
  }
  return Math.max(0, ...best);
}
