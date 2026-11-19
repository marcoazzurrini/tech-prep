# Monotonic Stack

A monotonic stack stays sorted. Before you push a new item, pop every entry that the new item beats. Each popped entry has just met the first later item that beats it. That answers the "next greater" or "next smaller" question for that entry.

## Worked example

For each price, find the next lower price to its right. Use `-1` if there is none.

```ts
const prices = [8, 4, 6, 2, 3];
const nextLower = new Array(prices.length).fill(-1);
const stack: number[] = []; // indexes that still wait for a lower price

for (let i = 0; i < prices.length; i++) {
  while (stack.length > 0 && prices[i] < prices[stack[stack.length - 1]]) {
    nextLower[stack.pop()!] = prices[i];
  }
  stack.push(i);
}

// nextLower: [4, 2, 2, -1, -1]
```

## Why it works

- The stack holds indexes, not values. An index gives you both the value and the place to write the answer.
- The `while` loop pops every waiting price that is higher than the new one. The new price is their answer.
- Each index is pushed once and popped at most once, so the whole loop is O(n).
- After the pops, the entry on top is the nearest item on the **left** that the new item did not beat.

## When to use it

- The task asks for the next or previous item that is greater or smaller.
- It asks how far each item must look or wait until something beats it.
- The simple solution scans left or right from every item, in O(n^2).
