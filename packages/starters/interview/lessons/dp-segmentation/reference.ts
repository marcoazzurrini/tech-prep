export function canSplitIntoShortPalindromes(s: string): boolean {
  const n = s.length;
  // ok[i] is true when the first i letters split into good pieces.
  const ok = new Array<boolean>(n + 1).fill(false);
  ok[0] = true;
  for (let i = 2; i <= n; i++) {
    // The last piece has length 2 or 3. The letters before it must split too.
    if (s[i - 2] === s[i - 1] && ok[i - 2]) ok[i] = true;
    if (i >= 3 && s[i - 3] === s[i - 1] && ok[i - 3]) ok[i] = true;
  }
  return ok[n];
}
