export function longestFreeGap(intervals: number[][]): number {
  const sorted = [...intervals].sort((a, b) => a[0]! - b[0]!); // by start
  let longest = 0;
  let blockEnd = sorted[0]![1]!; // end of the current merged block
  for (const interval of sorted) {
    const start = interval[0]!;
    const end = interval[1]!;
    if (start > blockEnd) longest = Math.max(longest, start - blockEnd); // no overlap: a gap
    blockEnd = Math.max(blockEnd, end); // keep the furthest end
  }
  return longest;
}
