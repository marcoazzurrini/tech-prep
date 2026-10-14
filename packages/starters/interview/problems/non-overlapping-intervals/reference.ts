export function eraseOverlapIntervals(intervals: number[][]): number {
  // Greedy: keep the interval that ends earliest, drop anything that clashes with it.
  const sorted = [...intervals].sort((a, b) => a[1]! - b[1]!);
  let removed = 0;
  let prevEnd = -Infinity;
  for (const [start, end] of sorted as [number, number][]) {
    if (start >= prevEnd) prevEnd = end;
    else removed++;
  }
  return removed;
}
