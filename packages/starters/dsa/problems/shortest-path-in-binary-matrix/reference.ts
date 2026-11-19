export function shortestPathBinaryMatrix(grid: number[][]): number {
  const n = grid.length;
  if (grid[0]![0] === 1 || grid[n - 1]![n - 1] === 1) return -1;
  // BFS by levels: every cell of `level` is `length` cells away from the start.
  const seen = grid.map((row) => row.map(() => false));
  seen[0]![0] = true;
  let level: [number, number][] = [[0, 0]];
  let length = 1;
  while (level.length > 0) {
    const nextLevel: [number, number][] = [];
    for (const [r, c] of level) {
      if (r === n - 1 && c === n - 1) return length;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr;
          const nc = c + dc;
          if (nr < 0 || nr >= n || nc < 0 || nc >= n) continue;
          if (grid[nr]![nc] !== 0 || seen[nr]![nc]) continue;
          seen[nr]![nc] = true; // the first visit is the shortest one
          nextLevel.push([nr, nc]);
        }
      }
    }
    level = nextLevel;
    length++;
  }
  return -1;
}
