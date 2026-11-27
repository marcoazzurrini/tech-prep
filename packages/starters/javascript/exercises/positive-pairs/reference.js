export function positivePairs(nums) {
  return nums.flatMap((n) => (n > 0 ? [n, n * 2] : []));
}
