export function groupSizes(n: number, edges: number[][]): number[] {
  const graph: number[][] = Array.from({ length: n }, () => []);
  for (const [a, b] of edges) {
    graph[a!]!.push(b!);
    graph[b!]!.push(a!);
  }

  const visited = new Array<boolean>(n).fill(false);
  const sizes: number[] = [];
  // Every unvisited node starts a new group.
  for (let start = 0; start < n; start++) {
    if (visited[start]) continue;
    visited[start] = true;
    const stack = [start];
    let size = 0;
    while (stack.length > 0) {
      const node = stack.pop()!;
      size++;
      for (const neighbour of graph[node]!) {
        if (visited[neighbour]) continue;
        visited[neighbour] = true; // mark when pushed
        stack.push(neighbour);
      }
    }
    sizes.push(size);
  }
  return sizes.sort((x, y) => x - y);
}
