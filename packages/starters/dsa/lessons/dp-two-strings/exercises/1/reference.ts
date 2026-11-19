export function bestCommonScore(a: string, b: string): number {
  // best[i][j] = best score for the prefixes a[:i] and b[:j].
  const best = Array.from({ length: a.length + 1 }, () =>
    new Array<number>(b.length + 1).fill(0)
  );
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      // Skip the last letter of a, or the last letter of b.
      best[i]![j] = Math.max(best[i - 1]![j]!, best[i]![j - 1]!);
      if (a[i - 1] === b[j - 1]) {
        // Or match the two last letters and add the score.
        const score = a.charCodeAt(i - 1) - 96;
        best[i]![j] = Math.max(best[i]![j]!, best[i - 1]![j - 1]! + score);
      }
    }
  }
  return best[a.length]![b.length]!;
}
