# Cycle Detection

A directed graph has a cycle when you can follow edges from a node and arrive back at it. Run a DFS and remember which nodes are on the current path. An edge to a node that is still on the path closes a cycle. A node that is finished is safe: meeting it again is not a cycle.

## Worked example

Each spreadsheet cell lists the cells its formula reads. Check if any formula ends up reading itself.

```ts
const reads: Record<string, string[]> = {
  A1: ["B1", "C1"],
  B1: ["C1"],
  C1: ["D1"],
  D1: ["B1"],
};
const state = new Map<string, "onPath" | "done">();

const hasCycle = (cell: string): boolean => {
  if (state.has(cell)) return state.get(cell) === "onPath";
  state.set(cell, "onPath");
  for (const next of reads[cell] ?? []) {
    if (hasCycle(next)) return true;
  }
  state.set(cell, "done");
  return false;
};
const loop = Object.keys(reads).some(hasCycle);
// loop: true  (B1 reads C1, C1 reads D1, D1 reads B1)
```

## Why it works

- `"onPath"` marks the cells between the first cell and the current cell. Meeting one of them again closes a loop.
- `"done"` marks a cell whose search has ended with no cycle. The search can skip it.
- A plain visited set is not enough. `A1` reaches `C1` in two ways, and that alone is not a cycle.

## When to use it

- Things depend on each other, and the task asks if they can all be done, or if something waits for itself.
- The words "circular", "deadlock", "loop" or "prerequisite" appear.
- The edges have a direction: "a needs b", "a calls b", "a comes before b".
