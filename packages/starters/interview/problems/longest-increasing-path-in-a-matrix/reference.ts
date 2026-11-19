export function longestIncreasingPath(matrix: number[][]): number {
  const rows = matrix.length;
  const cols = matrix[0]!.length;
  // memo[r][c] = longest increasing path that starts at (r, c). 0 means not solved yet.
  const memo = matrix.map((row) => row.map(() => 0));

  const dfs = (r: number, c: number): number => {
    if (memo[r]![c]! > 0) return memo[r]![c]!;
    let best = 1;
    for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]] as const) {
      const nr = r + dr;
      const nc = c + dc;
      // Only step to a larger value, so the search can never loop.
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && matrix[nr]![nc]! > matrix[r]![c]!) {
        best = Math.max(best, 1 + dfs(nr, nc));
      }
    }
    memo[r]![c] = best;
    return best;
  };

  let longest = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      longest = Math.max(longest, dfs(r, c));
    }
  }
  return longest;
}
