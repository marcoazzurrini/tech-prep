export function canReachBorder(
  grid: number[][],
  row: number,
  col: number
): boolean {
  const rows = grid.length;
  const cols = grid[0]!.length;
  const seen = grid.map((line) => line.map(() => false));

  const dfs = (r: number, c: number): boolean => {
    // Stop on a wall or on a cell we have seen.
    if (grid[r]![c] === 1 || seen[r]![c]) return false;
    seen[r]![c] = true; // mark before recursing
    if (r === 0 || r === rows - 1 || c === 0 || c === cols - 1) return true;
    // Not on the border, so all four neighbours are inside the grid.
    return dfs(r + 1, c) || dfs(r - 1, c) || dfs(r, c + 1) || dfs(r, c - 1);
  };

  return dfs(row, col);
}
