export function lengthOfLIS(nums: number[]): number {
  // tails[k] = smallest possible last value of an increasing subsequence of length k + 1.
  const tails: number[] = [];
  for (const x of nums) {
    let lo = 0;
    let hi = tails.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (tails[mid]! < x) lo = mid + 1;
      else hi = mid;
    }
    tails[lo] = x;
  }
  return tails.length;
}
