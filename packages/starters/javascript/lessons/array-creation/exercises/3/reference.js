export function stepRange(start, count, step) {
  return Array.from({ length: count }, (_, i) => start + i * step);
}
