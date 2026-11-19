export function sameGroupQueries(
  n: number,
  links: number[][],
  queries: number[][]
): boolean[] {
  const parent = Array.from({ length: n }, (_, i) => i);

  const find = (x: number): number => {
    while (parent[x] !== x) {
      parent[x] = parent[parent[x]!]!; // path halving keeps the paths short
      x = parent[x]!;
    }
    return x;
  };

  // Union: point the root of one group at the root of the other.
  for (const [a, b] of links) parent[find(a!)] = find(b!);
  // Same root means same group.
  return queries.map(([x, y]) => find(x!) === find(y!));
}
