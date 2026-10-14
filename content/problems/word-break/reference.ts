export function wordBreak(s: string, wordDict: string[]): boolean {
  const words = new Set(wordDict);
  const lengths = [...new Set(wordDict.map((w) => w.length))];
  // ok[i] is true when s[:i] splits into dictionary words.
  const ok = new Array<boolean>(s.length + 1).fill(false);
  ok[0] = true;
  for (let i = 1; i <= s.length; i++) {
    ok[i] = lengths.some((n) => n <= i && ok[i - n]! && words.has(s.slice(i - n, i)));
  }
  return ok[s.length]!;
}
