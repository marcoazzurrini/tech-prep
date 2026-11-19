# Hash Map plus Linked List

A doubly linked list keeps items in order, and can remove a node in O(1). But finding the node takes a walk. A map from key to node finds it in O(1). Use both: the map finds the node, the list moves it.

## Worked example

Remove the item `"b"` from the middle of a list, without a walk.

```ts
type Item = { name: string; prev: Item | null; next: Item | null };
const a: Item = { name: "a", prev: null, next: null };
const b: Item = { name: "b", prev: a, next: null };
const c: Item = { name: "c", prev: b, next: null };
a.next = b;
b.next = c;
const byName = new Map([
  ["a", a],
  ["b", b],
  ["c", c],
]);

const item = byName.get("b")!;
item.prev!.next = item.next;
item.next!.prev = item.prev;
byName.delete("b");

// the list is now a <-> c
```

## Why it works

- `byName.get` jumps straight to the node. No walk.
- The node knows `prev` and `next`, so two assignments cut it out.
- The map and the list must always hold the same items. Change both together.
- Put a dummy node at each end. Then `prev` and `next` are never `null`.

## When to use it

- A design task wants O(1) for both "find by key" and "change the order".
- The order is by use or by arrival: least recently used, oldest first.
- Items leave from the middle of the order, not only from the ends.
