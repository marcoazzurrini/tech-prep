export function makeSeatChart(rows, cols, taken) {
  const chart = Array.from({ length: rows }, () => Array(cols).fill("open"));
  for (const [row, col] of taken) {
    if (row >= 0 && row < rows && col >= 0 && col < cols) {
      chart[row][col] = "taken";
    }
  }
  return chart;
}
