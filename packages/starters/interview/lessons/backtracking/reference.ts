export function listClimbs(total: number): number[][] {
  const result: number[][] = [];
  const moves: number[] = [];

  const backtrack = (left: number): void => {
    if (left === 0) {
      result.push([...moves]); // save a copy
      return;
    }
    for (const step of [1, 2]) {
      if (step > left) continue;
      moves.push(step); // choose
      backtrack(left - step);
      moves.pop(); // undo
    }
  };

  backtrack(total);
  return result;
}
