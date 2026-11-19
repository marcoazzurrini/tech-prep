# Linked List Traversal

A linked list has no indexes. You reach a node only by following `next` from the node before it. So you walk the list with one variable. Anything you need later, you keep in other variables.

## Worked example

Find the largest value in a list.

```ts
// head: 4 -> 9 -> 2
let largest = head.val;
let node: ListNode | null = head.next;

while (node) {
  if (node.val > largest) largest = node.val;
  node = node.next;
}

// largest is 9
```

## Why it works

- `node = node.next` moves one node forward. It is the only way to move.
- `while (node)` stops after the last node, because the last `next` is `null`.
- `largest` remembers what the walk has seen. You cannot walk back to look again.

## When to use it

- The input is the `head` of a linked list.
- The answer needs every node once, in order: a count, a sum, a search.
- You need a node or a value again later. Save it in a variable before you move on.
