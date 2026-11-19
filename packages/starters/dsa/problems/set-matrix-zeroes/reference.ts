export function setZeroes(matrix: number[][]): void {
  const rows = matrix.length;
  const cols = matrix[0]!.length;
  // Use row 0 and column 0 as markers; remember separately whether they had a zero.
  const firstRowZero = matrix[0]!.some((v) => v === 0);
  const firstColZero = matrix.some((row) => row[0] === 0);
  for (let r = 1; r < rows; r++) {
    for (let c = 1; c < cols; c++) {
      if (matrix[r]![c] === 0) {
        matrix[r]![0] = 0;
        matrix[0]![c] = 0;
      }
    }
  }
  for (let r = 1; r < rows; r++) {
    for (let c = 1; c < cols; c++) {
      if (matrix[r]![0] === 0 || matrix[0]![c] === 0) matrix[r]![c] = 0;
    }
  }
  if (firstRowZero) matrix[0]!.fill(0);
  if (firstColZero) for (const row of matrix) row[0] = 0;
}
