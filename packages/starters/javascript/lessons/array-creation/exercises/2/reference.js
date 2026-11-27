export function makeGrid(rows, cols, value) {
  return Array.from({ length: rows }, () => Array(cols).fill(value));
}
