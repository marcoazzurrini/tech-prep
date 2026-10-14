export function characterReplacement(s: string, k: number): number {
  const counts = new Map<string, number>();
  let left = 0;
  let maxFreq = 0;
  let best = 0;
  for (let right = 0; right < s.length; right++) {
    const count = (counts.get(s[right]) ?? 0) + 1;
    counts.set(s[right], count);
    maxFreq = Math.max(maxFreq, count);
    // Window is valid while the chars that must change fit in k.
    if (right - left + 1 - maxFreq > k) {
      counts.set(s[left], (counts.get(s[left]) ?? 0) - 1);
      left++;
    }
    best = Math.max(best, right - left + 1);
  }
  return best;
}
