export function countReachableCells(grid: number[][]): number {
  const reach = grid.map((row) => row.map(() => false));
  let count = 0;
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r]!.length; c++) {
      // An open cell is reachable if it is the start, or its top or left cell is reachable.
      const top = r > 0 && reach[r - 1]![c]!;
      const left = c > 0 && reach[r]![c - 1]!;
      reach[r]![c] = grid[r]![c] === 0 && (r + c === 0 || top || left);
      if (reach[r]![c]) count++;
    }
  }
  return count;
}
