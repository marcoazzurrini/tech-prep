export function numDistinct(s: string, t: string): number {
  // ways[j] = number of ways to build the first j chars of t from the part of s read so far.
  const ways = new Array<number>(t.length + 1).fill(0);
  ways[0] = 1;
  for (const ch of s) {
    // Go backwards so that ways[j - 1] still belongs to the shorter prefix of s.
    for (let j = t.length; j >= 1; j--) {
      if (t[j - 1] === ch) {
        // Skip ch (keep ways[j]) or match it with t[j - 1] (add ways[j - 1]).
        ways[j]! += ways[j - 1]!;
      }
    }
  }
  return ways[t.length]!;
}
