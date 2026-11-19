export function rotateHalfTurn(matrix: number[][]): void {
  // Reverse the order of the rows: r goes to rows - 1 - r.
  matrix.reverse();
  // Reverse each row: c goes to cols - 1 - c.
  for (const row of matrix) {
    row.reverse();
  }
}
