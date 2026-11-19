export function maxAreaOfIsland(grid: number[][]): number {
  const rows = grid.length;
  const cols = grid[0]!.length;
  let best = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r]![c] !== 1) continue;
      // Sink the whole island with a stack and count its cells.
      grid[r]![c] = 0;
      const stack: [number, number][] = [[r, c]];
      let area = 0;
      while (stack.length > 0) {
        const [i, j] = stack.pop()!;
        area++;
        for (const [ni, nj] of [[i + 1, j], [i - 1, j], [i, j + 1], [i, j - 1]] as const) {
          if (ni >= 0 && ni < rows && nj >= 0 && nj < cols && grid[ni]![nj] === 1) {
            grid[ni]![nj] = 0; // mark when pushed, so no cell is counted twice
            stack.push([ni, nj]);
          }
        }
      }
      best = Math.max(best, area);
    }
  }
  return best;
}
