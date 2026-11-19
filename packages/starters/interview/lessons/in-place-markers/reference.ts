export function firstRepeatedValue(nums: number[]): number {
  for (const num of nums) {
    const value = Math.abs(num); // the cell may already carry a flag
    // A negative number at index value - 1 means: value was seen before.
    if (nums[value - 1]! < 0) return value;
    nums[value - 1] = -nums[value - 1]!;
  }
  return -1;
}
