export function subsetsWithDup(nums: number[]): number[][] {
  const sorted = [...nums].sort((a, b) => a - b); // equal values become neighbours
  const result: number[][] = [];
  const subset: number[] = [];

  const backtrack = (start: number): void => {
    result.push([...subset]);
    for (let i = start; i < sorted.length; i++) {
      // This value already started a branch at this depth.
      if (i > start && sorted[i] === sorted[i - 1]) continue;
      subset.push(sorted[i]!);
      backtrack(i + 1);
      subset.pop();
    }
  };

  backtrack(0);
  return result;
}
