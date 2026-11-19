export function orangesRotting(grid: number[][]): number {
  const rows = grid.length;
  const cols = grid[0]!.length;
  // Start with every rotten orange: the rot spreads from all of them at once.
  let level: [number, number][] = [];
  let fresh = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r]![c] === 2) level.push([r, c]);
      if (grid[r]![c] === 1) fresh++;
    }
  }
  let minutes = 0;
  // Each level of the BFS is one minute.
  while (level.length > 0 && fresh > 0) {
    const nextLevel: [number, number][] = [];
    for (const [r, c] of level) {
      for (const [nr, nc] of [[r + 1, c], [r - 1, c], [r, c + 1], [r, c - 1]] as const) {
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr]![nc] === 1) {
          grid[nr]![nc] = 2;
          fresh--;
          nextLevel.push([nr, nc]);
        }
      }
    }
    level = nextLevel;
    minutes++;
  }
  return fresh === 0 ? minutes : -1;
}
