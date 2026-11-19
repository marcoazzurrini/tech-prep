export function minWindow(s: string, t: string): string {
  const need = new Map<string, number>();
  for (const c of t) need.set(c, (need.get(c) ?? 0) + 1);
  let missing = t.length; // chars of t not yet covered by the window
  let left = 0;
  let bestStart = 0;
  let bestLen = Infinity;
  for (let right = 0; right < s.length; right++) {
    const c = s[right];
    if ((need.get(c) ?? 0) > 0) missing--;
    need.set(c, (need.get(c) ?? 0) - 1);
    while (missing === 0) {
      if (right - left + 1 < bestLen) {
        bestStart = left;
        bestLen = right - left + 1;
      }
      const out = s[left];
      need.set(out, (need.get(out) ?? 0) + 1);
      if ((need.get(out) ?? 0) > 0) missing++;
      left++;
    }
  }
  return bestLen === Infinity ? "" : s.slice(bestStart, bestStart + bestLen);
}
