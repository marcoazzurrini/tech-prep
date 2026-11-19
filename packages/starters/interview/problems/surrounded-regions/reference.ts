export function solve(board: string[][]): void {
  const rows = board.length;
  const cols = board[0]!.length;
  // Search from the border: every "O" reached from there is safe. Mark it "S".
  const stack: [number, number][] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const onBorder = r === 0 || r === rows - 1 || c === 0 || c === cols - 1;
      if (onBorder && board[r]![c] === "O") {
        board[r]![c] = "S";
        stack.push([r, c]);
      }
    }
  }
  while (stack.length > 0) {
    const [r, c] = stack.pop()!;
    for (const [nr, nc] of [[r + 1, c], [r - 1, c], [r, c + 1], [r, c - 1]] as const) {
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && board[nr]![nc] === "O") {
        board[nr]![nc] = "S";
        stack.push([nr, nc]);
      }
    }
  }
  // Every "O" that is left is surrounded. Safe cells turn back into "O".
  for (const row of board) {
    for (let c = 0; c < cols; c++) row[c] = row[c] === "S" ? "O" : "X";
  }
}
