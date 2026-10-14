export function findMin(nums: number[]): number {
  let lo = 0;
  let hi = nums.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (nums[mid] > nums[hi]) lo = mid + 1; // the drop is to the right of mid
    else hi = mid;
  }
  return nums[lo];
}
