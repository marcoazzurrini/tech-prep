export function fillGaps(row, fallback) {
  return row.map((item, index) => item ?? fallback[index]);
}
