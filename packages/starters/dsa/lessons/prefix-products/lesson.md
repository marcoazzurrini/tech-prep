# Prefix and Suffix Accumulation

Some answers need everything left of an index and everything right of it. Keep a running result while you walk from the left. Do the same from the right. Then combine the two results at each index.

## Worked example

For each day, add up the rain of all the other days.

```ts
const rain = [2, 0, 5, 1];
const others: number[] = new Array(rain.length).fill(0);

let before = 0;
for (let i = 0; i < rain.length; i++) {
  others[i] = before;
  before += rain[i];
}

let after = 0;
for (let i = rain.length - 1; i >= 0; i--) {
  others[i] += after;
  after += rain[i];
}

// others: [6, 8, 3, 7]
```

## Why it works

- `others[i] = before` runs first, and `before` grows after it. So `others[i]` holds only the days left of `i`.
- The second loop walks backwards. There, `after` holds only the days right of `i`.
- Each loop is O(n). A fresh sum for every index would be O(n²).

## When to use it

- The task asks, for each index, about "all the other elements", "everything before" or "everything after".
- You cannot undo the operation to remove one element. The task may forbid division, or the operation may be `max`.
- A loop inside a loop would compute almost the same total again for each index.
