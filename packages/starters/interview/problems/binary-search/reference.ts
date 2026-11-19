export function binarySearch(nums: number[], target: number): number {
  // The target, if present, is always inside lo..hi (both included).
  let lo = 0;
  let hi = nums.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (nums[mid] === target) return mid;
    if (nums[mid]! < target) {
      lo = mid + 1; // mid is too small: drop it and the left part
    } else {
      hi = mid - 1; // mid is too large: drop it and the right part
    }
  }
  return -1;
}
