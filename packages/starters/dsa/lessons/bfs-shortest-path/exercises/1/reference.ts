export function fewestFlights(
  n: number,
  flights: number[][],
  start: number,
  target: number
): number {
  const graph: number[][] = Array.from({ length: n }, () => []);
  for (const [a, b] of flights) {
    graph[a!]!.push(b!);
    graph[b!]!.push(a!);
  }

  // BFS by levels: every airport of `level` is `count` flights from the start.
  const seen = new Set([start]);
  let level = [start];
  let count = 0;
  while (level.length > 0) {
    if (level.includes(target)) return count;
    const nextLevel: number[] = [];
    for (const airport of level) {
      for (const neighbour of graph[airport]!) {
        if (seen.has(neighbour)) continue;
        seen.add(neighbour); // the first visit is the shortest one
        nextLevel.push(neighbour);
      }
    }
    level = nextLevel;
    count++;
  }
  return -1;
}
