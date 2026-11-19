export function isValidSudoku(board: string[][]): boolean {
  const seen = new Set<string>();
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const d = board[r][c];
      if (d === ".") continue;
      // One key per rule. Cells of the same box share the same box number.
      const box = Math.floor(r / 3) * 3 + Math.floor(c / 3);
      for (const key of [`row ${r} ${d}`, `col ${c} ${d}`, `box ${box} ${d}`]) {
        if (seen.has(key)) return false;
        seen.add(key);
      }
    }
  }
  return true;
}
