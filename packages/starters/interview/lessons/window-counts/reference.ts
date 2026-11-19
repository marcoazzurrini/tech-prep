export function longestWithLetterLimit(s: string, limit: number): number {
  const count = new Map<string, number>(); // letter counts of the window
  let left = 0;
  let best = 0;
  for (let right = 0; right < s.length; right++) {
    const c = s[right];
    count.set(c, (count.get(c) ?? 0) + 1);
    // Only the letter that just entered can be over the limit.
    while (count.get(c)! > limit) {
      count.set(s[left], count.get(s[left])! - 1);
      left++;
    }
    best = Math.max(best, right - left + 1);
  }
  return best;
}
