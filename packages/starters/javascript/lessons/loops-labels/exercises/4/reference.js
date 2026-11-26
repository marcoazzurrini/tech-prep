export function cleanRows(grid) {
  const clean = [];

  rows: for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      if (grid[r][c] < 0) continue rows;
    }

    clean.push(r);
  }

  return clean;
}
