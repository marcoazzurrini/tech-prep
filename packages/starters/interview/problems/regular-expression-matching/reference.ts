export function isMatch(s: string, p: string): boolean {
  const m = s.length;
  const n = p.length;
  // ok[i][j] = the first i chars of s match the first j chars of p.
  const ok = Array.from({ length: m + 1 }, () => new Array<boolean>(n + 1).fill(false));
  ok[0]![0] = true;
  const same = (i: number, j: number) => p[j - 1] === "." || p[j - 1] === s[i - 1];
  for (let i = 0; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (p[j - 1] === "*") {
        // Use the starred char zero times, or let it match one more char of s.
        const zero = ok[i]![j - 2]!;
        const more = i > 0 && same(i, j - 1) && ok[i - 1]![j]!;
        ok[i]![j] = zero || more;
      } else {
        // A plain char or a dot must match the last char of the prefix of s.
        ok[i]![j] = i > 0 && same(i, j) && ok[i - 1]![j - 1]!;
      }
    }
  }
  return ok[m]![n]!;
}
