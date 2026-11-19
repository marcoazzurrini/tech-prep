export function countAbsent(roster: string[], present: string[]): number {
  // A set makes each "did this student come?" check O(1).
  const came = new Set(present);
  let absent = 0;
  for (const name of roster) {
    if (!came.has(name)) absent++;
  }
  return absent;
}
