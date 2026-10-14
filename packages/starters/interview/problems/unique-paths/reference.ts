export function uniquePaths(m: number, n: number): number {
  // row[j] = paths to cell (i, j); the cell above is row[j], the cell to the left is row[j - 1].
  const row = new Array<number>(n).fill(1);
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      row[j]! += row[j - 1]!;
    }
  }
  return row[n - 1]!;
}
