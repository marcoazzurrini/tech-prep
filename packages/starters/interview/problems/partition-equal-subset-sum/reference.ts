export function canPartition(nums: number[]): boolean {
  const total = nums.reduce((sum, num) => sum + num, 0);
  if (total % 2 === 1) return false;
  const half = total / 2;
  // can[t] is true when some of the numbers add up to exactly t.
  const can = new Array<boolean>(half + 1).fill(false);
  can[0] = true;
  for (const num of nums) {
    // Go from high to low, so each number is used at most once.
    for (let t = half; t >= num; t--) {
      if (can[t - num]) can[t] = true;
    }
  }
  return can[half];
}
