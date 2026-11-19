export function countComponents(n: number, edges: number[][]): number {
  const parent = Array.from({ length: n }, (_, i) => i);
  const find = (x: number): number => {
    while (parent[x] !== x) {
      parent[x] = parent[parent[x]!]!; // path halving
      x = parent[x]!;
    }
    return x;
  };

  let components = n;
  for (const [a, b] of edges) {
    const ra = find(a!);
    const rb = find(b!);
    if (ra !== rb) {
      parent[ra] = rb;
      components--; // each successful union merges two components
    }
  }
  return components;
}
