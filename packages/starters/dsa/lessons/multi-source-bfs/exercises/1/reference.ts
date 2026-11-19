export function distanceToNearestHub(
  n: number,
  roads: number[][],
  hubs: number[]
): number[] {
  const graph: number[][] = Array.from({ length: n }, () => []);
  for (const [a, b] of roads) {
    graph[a!]!.push(b!);
    graph[b!]!.push(a!);
  }

  // Every hub starts in the queue with distance 0.
  const dist = new Array<number>(n).fill(-1);
  for (const hub of hubs) dist[hub] = 0;
  const queue = [...hubs];
  for (let head = 0; head < queue.length; head++) {
    const town = queue[head]!;
    for (const neighbour of graph[town]!) {
      // -1 means not reached yet. The first visit comes from the nearest hub.
      if (dist[neighbour] !== -1) continue;
      dist[neighbour] = dist[town]! + 1;
      queue.push(neighbour);
    }
  }
  return dist;
}
