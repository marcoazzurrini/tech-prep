function robLine(houses: number[]): number {
  let skip = 0;
  let take = 0;
  for (const x of houses) {
    [skip, take] = [take, Math.max(take, skip + x)];
  }
  return take;
}

export function rob(nums: number[]): number {
  if (nums.length === 1) return nums[0]!;
  // The first and last house can't both be taken: drop one of them.
  return Math.max(robLine(nums.slice(1)), robLine(nums.slice(0, -1)));
}
