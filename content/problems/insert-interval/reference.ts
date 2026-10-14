export function insert(intervals: number[][], newInterval: number[]): number[][] {
  let [start, end] = newInterval as [number, number];
  const result: number[][] = [];
  let i = 0;
  const n = intervals.length;
  // Intervals that end before the new one starts.
  while (i < n && intervals[i]![1]! < start) result.push(intervals[i++]!);
  // Intervals that overlap the new one get folded into it.
  while (i < n && intervals[i]![0]! <= end) {
    start = Math.min(start, intervals[i]![0]!);
    end = Math.max(end, intervals[i]![1]!);
    i++;
  }
  result.push([start, end]);
  while (i < n) result.push(intervals[i++]!);
  return result;
}
