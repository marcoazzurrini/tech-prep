# Finding the Cycle Start

Fast and slow pointers meet somewhere inside a cycle. That is not yet where the cycle begins. Put a new pointer at the head. Move it and `slow` one step at a time. They meet at the first node of the cycle.

## Worked example

Find the node where a cycle begins.

```ts
// head: 1 -> 2 -> 3 -> 4 -> 5, and 5 points back to 3
let slow = head;
let fast = head;
do {
  slow = slow.next!;
  fast = fast.next!.next!;
} while (slow !== fast);

let start = head;
while (start !== slow) {
  start = start.next!;
  slow = slow.next!;
}

// start.val is 3
```

## Why it works

- The first loop is `do ... while`, because both pointers start equal at the head.
- The head and the meeting point are the same distance from the cycle start, plus whole laps. So two pointers at the same speed arrive there together.
- This code needs a cycle. If the list may end, check `fast` and `fast.next` in the first loop.

## When to use it

- The task asks where a cycle begins, or how long the part before it is.
- Each array value is a valid index. Then index `i` points to index `nums[i]`, and the array is a hidden linked list.
- You must use O(1) extra memory, so you cannot store the nodes you have seen.
