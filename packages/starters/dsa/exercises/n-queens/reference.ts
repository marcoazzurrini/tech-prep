export function solveNQueens(n: number): string[][] {
  const result: string[][] = [];
  const queens: number[] = []; // queens[row] is the column of the queen in that row
  const cols = new Set<number>();
  const diags = new Set<number>();
  const antis = new Set<number>();

  const backtrack = (row: number): void => {
    if (row === n) {
      result.push(queens.map((c) => ".".repeat(c) + "Q" + ".".repeat(n - c - 1)));
      return;
    }
    for (let col = 0; col < n; col++) {
      // row - col names one diagonal, row + col names the other.
      if (cols.has(col) || diags.has(row - col) || antis.has(row + col)) continue; // attacked
      cols.add(col);
      diags.add(row - col);
      antis.add(row + col);
      queens.push(col);
      backtrack(row + 1);
      queens.pop();
      cols.delete(col);
      diags.delete(row - col);
      antis.delete(row + col);
    }
  };

  backtrack(0);
  return result;
}
