export function longestDoublingChain(nums: number[]): number {
  const values = new Set(nums);
  let best = 0;
  for (const n of values) {
    // n starts a chain only when its half is missing.
    if (n % 2 === 0 && values.has(n / 2)) continue;
    let length = 1;
    let current = n;
    while (values.has(current * 2)) {
      current *= 2;
      length++;
    }
    best = Math.max(best, length);
  }
  return best;
}
