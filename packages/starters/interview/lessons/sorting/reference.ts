export function isConsecutiveRun(nums: number[]): boolean {
  // In sorted order, a run rises by exactly 1 at every step.
  const sorted = [...nums].sort((a, b) => a - b);
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] - sorted[i - 1] !== 1) return false;
  }
  return true;
}
