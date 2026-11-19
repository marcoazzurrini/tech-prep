# Heap / Priority Queue

A heap is a collection that always knows its smallest item. Reading that item is O(1). Adding an item, or removing the smallest, is O(log n). A max-heap does the same for the largest item. TypeScript has no built-in heap, so import `Heap` from `./ds.ts`. In Python, use `heapq`.

## Worked example

Put prices in a heap, and take them out from the cheapest up.

```ts
import { Heap } from "./ds.ts";

const prices = new Heap<number>(); // min-heap
for (const price of [40, 15, 30, 10]) prices.push(price);

prices.peek(); // 10: look at the smallest, do not remove it
prices.pop(); // 10: remove the smallest
prices.pop(); // 15: the next smallest
prices.push(5);
prices.peek(); // 5: a new item finds its place

const largestFirst = new Heap<number>((a, b) => b - a); // max-heap
```

## Why it works

- `push` and `pop` keep the smallest item on top. The other items are not fully sorted, and that is why each step is cheap.
- `pop` returns the smallest item that is left. So repeated pops give the items in sorted order.
- The comparator sets the order. `(a, b) => b - a` puts the largest item on top.

## When to use it

- You need the smallest or the largest item again and again, while items are added or removed.
- The task says "k largest", "k smallest" or "k closest". Keep a heap of size k.
- A sort would work once, but new items arrive after it.
