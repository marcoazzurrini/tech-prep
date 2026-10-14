export function combinationSum(candidates: number[], target: number): number[][] {
  const sorted = [...candidates].sort((a, b) => a - b);
  const result: number[][] = [];
  const combo: number[] = [];

  const backtrack = (start: number, remaining: number): void => {
    if (remaining === 0) {
      result.push([...combo]);
      return;
    }
    for (let i = start; i < sorted.length; i++) {
      const c = sorted[i]!;
      if (c > remaining) break;
      combo.push(c);
      backtrack(i, remaining - c); // same i: a number may be reused
      combo.pop();
    }
  };

  backtrack(0, target);
  return result;
}
