# Dummy Head Node

The first node of a list has no node before it. So adding or removing at the head needs its own code. Put a dummy node before the head. Then every real node has a node before it, and one piece of code handles every case. At the end, return `dummy.next`.

## Worked example

Build a list from the odd numbers of an array.

```ts
const dummy = new ListNode();
let tail = dummy;

for (const n of [4, 7, 1, 8, 5]) {
  if (n % 2 === 1) {
    tail.next = new ListNode(n);
    tail = tail.next;
  }
}

const head = dummy.next;
// head: 7 -> 1 -> 5
```

## Why it works

- `tail` starts at the dummy. So `tail.next = ...` also works for the first node, with no `if` for an empty list.
- `tail` always points to the last node. Adding a node is O(1).
- `dummy.next` is the real head. It is `null` when nothing was added.

## When to use it

- You build a new list node by node: merge, add, filter.
- The head itself may be removed or replaced.
- Your code has an `if` only for the first node. A dummy removes it.
