export function canAttendMeetings(intervals: number[][]): boolean {
  const sorted = [...intervals].sort((a, b) => a[0]! - b[0]!);
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i]![0]! < sorted[i - 1]![1]!) return false;
  }
  return true;
}
