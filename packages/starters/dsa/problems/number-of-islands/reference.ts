export function numIslands(grid: string[][]): number {
  const rows = grid.length;
  const cols = grid[0]!.length;
  let count = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r]![c] !== "1") continue;
      count++;
      // Sink the whole island with an explicit stack.
      grid[r]![c] = "0";
      const stack: [number, number][] = [[r, c]];
      while (stack.length > 0) {
        const [i, j] = stack.pop()!;
        for (const [ni, nj] of [[i + 1, j], [i - 1, j], [i, j + 1], [i, j - 1]] as const) {
          if (ni >= 0 && ni < rows && nj >= 0 && nj < cols && grid[ni]![nj] === "1") {
            grid[ni]![nj] = "0";
            stack.push([ni, nj]);
          }
        }
      }
    }
  }
  return count;
}
