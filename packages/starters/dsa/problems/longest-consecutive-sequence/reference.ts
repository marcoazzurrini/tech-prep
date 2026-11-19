export function longestConsecutive(nums: number[]): number {
  const values = new Set(nums);
  let best = 0;
  for (const n of values) {
    if (values.has(n - 1)) continue; // only count from the start of a run
    let length = 1;
    while (values.has(n + length)) length++;
    best = Math.max(best, length);
  }
  return best;
}
