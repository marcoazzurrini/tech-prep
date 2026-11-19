export function maxPayWithRest(pay: number[]): number {
  // States at the end of a day: rested, worked 1 day in a row, worked 2 days in a row.
  let rest = 0;
  let one = -Infinity;
  let two = -Infinity;
  for (const p of pay) {
    // A first work day follows a rest day. A second work day follows a first one.
    const nextRest = Math.max(rest, one, two);
    two = one + p;
    one = rest + p;
    rest = nextRest;
  }
  return Math.max(rest, one, two);
}
