export function canReachHospital(
  n: number,
  streets: number[][],
  hospitals: number[]
): number[] {
  // Reverse every street: cameFrom[x] lists the crossings with a street into x.
  const cameFrom: number[][] = Array.from({ length: n }, () => []);
  for (const [from, to] of streets) cameFrom[to!]!.push(from!);

  // Search backwards from the hospitals. Every crossing found can drive to one.
  const seen = new Set(hospitals);
  const stack = [...hospitals];
  while (stack.length > 0) {
    for (const crossing of cameFrom[stack.pop()!]!) {
      if (seen.has(crossing)) continue;
      seen.add(crossing);
      stack.push(crossing);
    }
  }
  return [...seen].sort((x, y) => x - y);
}
