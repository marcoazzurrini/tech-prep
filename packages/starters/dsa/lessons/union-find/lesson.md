# Union-Find

Union-Find tracks groups while links arrive one at a time. Every node has a parent pointer. Follow the pointers up and you reach the root, which names the group. `find` returns the root of a node. `union` merges two groups by pointing one root at the other.

## Worked example

Join five computers with three cables. Then label each computer with the root of its group.

```ts
const parent = [0, 1, 2, 3, 4];

const find = (x: number): number => {
  while (parent[x] !== x) x = parent[x];
  return x;
};
const union = (a: number, b: number) => {
  parent[find(a)] = find(b);
};

union(0, 1);
union(3, 4);
union(1, 4);

const labels = [0, 1, 2, 3, 4].map(find);
// labels: [4, 4, 2, 4, 4]
```

## Why it works

- At the start every node is its own parent. So every node is a group of one.
- `union` links the two **roots**, not the two nodes. That moves a whole group at once.
- Two nodes are in the same group exactly when `find` returns the same root for both.

## When to use it

- Links arrive one by one, and the task asks about groups: how many there are, or whether two nodes are joined.
- The task asks which link was not needed, or which link closes a loop. That is a link between two nodes with the same root.
- The edges have no direction, and no edge is ever removed.
