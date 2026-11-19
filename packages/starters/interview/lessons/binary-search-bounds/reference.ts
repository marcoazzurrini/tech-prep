export function countInRange(
  nums: number[],
  low: number,
  high: number
): number {
  // Index of the first value >= x, or nums.length if there is none.
  const firstAtLeast = (x: number): number => {
    let lo = 0;
    let hi = nums.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (nums[mid]! >= x) hi = mid;
      else lo = mid + 1;
    }
    return lo;
  };

  // Values below high + 1, minus values below low.
  return firstAtLeast(high + 1) - firstAtLeast(low);
}
