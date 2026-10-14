export function twoSum(nums: number[], target: number): number[] {
  const indexOf = new Map<number, number>(); // value -> index of an earlier element
  for (let i = 0; i < nums.length; i++) {
    const j = indexOf.get(target - nums[i]);
    if (j !== undefined) return [j, i];
    indexOf.set(nums[i], i);
  }
  return [];
}
