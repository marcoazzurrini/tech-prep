export function rob(nums: number[]): number {
  // skip = best total without the previous house; take = best overall so far.
  let skip = 0;
  let take = 0;
  for (const x of nums) {
    [skip, take] = [take, Math.max(take, skip + x)];
  }
  return take;
}
