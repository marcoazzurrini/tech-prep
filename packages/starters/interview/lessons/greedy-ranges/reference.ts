export function roomCountRange(log: string): number[] {
  let low = 0; // fewest people possible so far
  let high = 0; // most people possible so far
  for (const event of log) {
    if (event === "E") {
      low++;
      high++;
    } else if (event === "L") {
      low--;
      high--;
    } else {
      high++; // "?": nobody or one person entered
    }
    // Even the fullest room had nobody to leave.
    if (high < 0) return [];
    // An empty room is ruled out by "L"; the count is never negative.
    low = Math.max(low, 0);
  }
  return [low, high];
}
