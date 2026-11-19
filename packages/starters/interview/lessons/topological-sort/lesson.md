# Topological Sort

A topological order puts each node after everything it depends on. Kahn's algorithm builds one. Count the incoming edges of every node. Take a node whose count is zero, then lower the count of each node that comes after it. Repeat. Nodes that are never taken are on a cycle.

## Worked example

Put the steps of making tea in a valid order. Each rule is `[first, then]`.

```ts
const rules = [
  ["boil", "pour"],
  ["cup", "pour"],
  ["pour", "drink"],
];
const after = new Map<string, string[]>();
const waiting = new Map<string, number>();
for (const [first, then] of rules) {
  after.set(first, [...(after.get(first) ?? []), then]);
  waiting.set(first, waiting.get(first) ?? 0);
  waiting.set(then, (waiting.get(then) ?? 0) + 1);
}
const order = [...waiting.keys()].filter((step) => waiting.get(step) === 0);
for (const step of order) {
  for (const then of after.get(step) ?? []) {
    waiting.set(then, waiting.get(then)! - 1);
    if (waiting.get(then) === 0) order.push(then);
  }
}
// order: ["boil", "cup", "pour", "drink"]
```

## Why it works

- `waiting` counts the steps that must still come before each step. Zero means the step is free.
- Taking a step frees the steps after it: each of their counts drops by one.
- `order` is also the queue. The second loop reads the steps pushed inside it. If `order` ends up shorter than the number of steps, the rest are on a cycle.

## When to use it

- The task gives "a before b" rules and asks for an order that follows them all.
- The words "prerequisite", "depends on", "build order" or "schedule" appear.
- You must also say when no order exists. Leftover nodes tell you.
