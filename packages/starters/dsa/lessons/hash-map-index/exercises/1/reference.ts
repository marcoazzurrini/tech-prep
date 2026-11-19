export function previousEqualIndex(nums: number[]): number[] {
  const lastIndex = new Map<number, number>(); // value -> index where it was last seen
  const prev: number[] = [];
  for (let i = 0; i < nums.length; i++) {
    prev.push(lastIndex.get(nums[i]) ?? -1);
    // Store after the lookup, so an element never finds itself.
    lastIndex.set(nums[i], i);
  }
  return prev;
}
