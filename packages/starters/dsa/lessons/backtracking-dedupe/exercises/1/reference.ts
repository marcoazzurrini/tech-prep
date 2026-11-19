export function distinctPicks(nums: number[], size: number): number[][] {
  const sorted = [...nums].sort((a, b) => a - b); // equal values become neighbours
  const result: number[][] = [];
  const pick: number[] = [];

  const backtrack = (start: number): void => {
    if (pick.length === size) {
      result.push([...pick]);
      return;
    }
    for (let i = start; i < sorted.length; i++) {
      if (i > start && sorted[i] === sorted[i - 1]) continue; // same value at the same depth
      pick.push(sorted[i]!);
      backtrack(i + 1);
      pick.pop();
    }
  };

  backtrack(0);
  return result;
}
