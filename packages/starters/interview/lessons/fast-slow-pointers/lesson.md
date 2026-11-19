# Fast and Slow Pointers

Start two pointers at the head. `slow` moves one node per step. `fast` moves two. When `fast` reaches the end, `slow` is at the middle. In a list with a cycle, `fast` never reaches an end. It catches `slow` inside the cycle.

## Worked example

Find the middle node of a list.

```ts
// head: 1 -> 2 -> 3 -> 4 -> 5
let slow = head;
let fast: ListNode | null = head;

while (fast && fast.next) {
  slow = slow.next!;
  fast = fast.next.next;
}

// slow.val is 3: the middle node
```

## Why it works

- `fast` covers twice the distance of `slow`. When `fast` is done, `slow` has done half the list.
- `fast && fast.next` checks two nodes before the double step. So `fast.next.next` never fails.
- In a cycle, `fast` gains one node on `slow` per step. So they must meet.

## When to use it

- You need the middle of a list in one pass, without the length.
- The task asks if a list has a cycle, with O(1) extra memory.
- You must split a list into two halves.
