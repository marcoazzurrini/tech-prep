export function countExactlyTwice(nums: number[]): number {
  // Count how often each value appears.
  const counts = new Map<number, number>();
  for (const n of nums) {
    counts.set(n, (counts.get(n) ?? 0) + 1);
  }
  // Then look at each different value once.
  let twice = 0;
  for (const count of counts.values()) {
    if (count === 2) twice++;
  }
  return twice;
}
