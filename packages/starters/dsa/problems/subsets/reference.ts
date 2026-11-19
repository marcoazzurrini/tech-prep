export function subsets(nums: number[]): number[][] {
  const result: number[][] = [];
  const subset: number[] = [];

  const backtrack = (start: number): void => {
    result.push([...subset]); // every partial choice is a subset
    for (let i = start; i < nums.length; i++) {
      subset.push(nums[i]!); // choose
      backtrack(i + 1); // only later numbers, so no subset repeats
      subset.pop(); // undo
    }
  };

  backtrack(0);
  return result;
}
