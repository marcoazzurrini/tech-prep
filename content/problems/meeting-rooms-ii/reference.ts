export function minMeetingRooms(intervals: number[][]): number {
  // Sweep line over sorted starts and sorted ends.
  const starts = intervals.map((iv) => iv[0]!).sort((a, b) => a - b);
  const ends = intervals.map((iv) => iv[1]!).sort((a, b) => a - b);
  let rooms = 0;
  let best = 0;
  let e = 0;
  for (const start of starts) {
    while (ends[e]! <= start) {
      e++;
      rooms--;
    }
    rooms++;
    best = Math.max(best, rooms);
  }
  return best;
}
