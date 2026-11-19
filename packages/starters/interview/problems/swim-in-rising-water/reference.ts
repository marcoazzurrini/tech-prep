import { Heap } from "./ds.ts";

export function swimInWater(grid: number[][]): number {
  const n = grid.length;
  const seen = grid.map((row) => row.map(() => false));
  seen[0][0] = true;
  // [time needed to stand in the cell, row, col]
  const heap = new Heap<[number, number, number]>((a, b) => a[0] - b[0]);
  heap.push([grid[0][0], 0, 0]);
  while (heap.size > 0) {
    // The cell that can be reached at the earliest time.
    const top = heap.pop();
    if (top === undefined) break;
    const [time, r, c] = top;
    if (r === n - 1 && c === n - 1) return time;
    for (const [nr, nc] of [[r + 1, c], [r - 1, c], [r, c + 1], [r, c - 1]]) {
      if (nr < 0 || nr >= n || nc < 0 || nc >= n || seen[nr][nc]) continue;
      seen[nr][nc] = true;
      // A path costs its highest cell, not the sum of its cells.
      heap.push([Math.max(time, grid[nr][nc]), nr, nc]);
    }
  }
  return -1;
}
