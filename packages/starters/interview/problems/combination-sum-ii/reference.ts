export function combinationSum2(candidates: number[], target: number): number[][] {
  const sorted = [...candidates].sort((a, b) => a - b); // equal values become neighbours
  const result: number[][] = [];
  const combo: number[] = [];

  const backtrack = (start: number, remaining: number): void => {
    if (remaining === 0) {
      result.push([...combo]);
      return;
    }
    for (let i = start; i < sorted.length; i++) {
      const c = sorted[i]!;
      if (c > remaining) break; // sorted, so every later candidate is too big as well
      if (i > start && c === sorted[i - 1]) continue; // value already tried at this depth
      combo.push(c);
      backtrack(i + 1, remaining - c); // i + 1: each item once
      combo.pop();
    }
  };

  backtrack(0, target);
  return result;
}
