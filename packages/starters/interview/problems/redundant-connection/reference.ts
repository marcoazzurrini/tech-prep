export function findRedundantConnection(edges: number[][]): number[] {
  const parent = Array.from({ length: edges.length + 1 }, (_, i) => i);

  const find = (x: number): number => {
    while (parent[x] !== x) {
      parent[x] = parent[parent[x]!]!; // path halving keeps the paths short
      x = parent[x]!;
    }
    return x;
  };

  for (const [a, b] of edges) {
    const rootA = find(a!);
    const rootB = find(b!);
    // Both ends are already in one group: this edge closes the cycle.
    if (rootA === rootB) return [a!, b!];
    parent[rootA] = rootB;
  }
  return [];
}
