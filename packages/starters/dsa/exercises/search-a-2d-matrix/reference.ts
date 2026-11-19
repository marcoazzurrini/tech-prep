export function searchMatrix(matrix: number[][], target: number): boolean {
  const rows = matrix.length;
  const cols = matrix[0]!.length;
  // Read row after row and the grid is one sorted list of rows * cols values.
  let lo = 0;
  let hi = rows * cols - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    // Turn the list position back into a row and a column.
    const value = matrix[Math.floor(mid / cols)]![mid % cols]!;
    if (value === target) return true;
    if (value < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return false;
}
