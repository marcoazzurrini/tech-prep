# Reversing Links

To reverse a list, turn each `next` pointer around. Use three variables: `prev`, `current` and `next`. Each step turns one link, then moves forward.

## Worked example

Move every node of the list `rest` onto the front of the list `done`. The nodes arrive in reverse order.

```ts
// rest: 1 -> 2 -> 3
// done: 9
let prev: ListNode | null = done;
let current: ListNode | null = rest;

while (current) {
  const next = current.next;
  current.next = prev;
  prev = current;
  current = next;
}

// prev: 3 -> 2 -> 1 -> 9
```

## Why it works

- `next` saves the rest of the list. After `current.next` changes, there is no other way to reach it.
- `current.next = prev` turns one link around.
- When the loop ends, `prev` is the new head. Start `prev` at `null` to reverse a whole list.

## When to use it

- The task says "reverse" a list, or a part of a list.
- You must read a list from the back with O(1) extra memory. Reverse it first, or reverse its second half.
- The task wants the nodes moved, not the values copied.
