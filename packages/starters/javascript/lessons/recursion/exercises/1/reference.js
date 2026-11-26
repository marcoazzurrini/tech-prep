export function cellsAfter(cells, days) {
  if (days === 0) {
    return cells;
  }

  return 2 * cellsAfter(cells, days - 1);
}
