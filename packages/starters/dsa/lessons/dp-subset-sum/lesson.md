# 0/1 Knapsack

Each item is taken once or not at all. Keep a table of the totals you can reach. Add the items one by one. For each item, update the totals from high to low, so the item is not counted twice.

## Worked example

A bag holds at most 10 kilos. Find the heaviest load you can pack from three weights.

```ts
const weights = [4, 7, 5];
const limit = 10;
// can[t] = true when some of the weights add up to exactly t
const can = new Array<boolean>(limit + 1).fill(false);
can[0] = true;

for (const w of weights) {
  for (let t = limit; t >= w; t--) {
    if (can[t - w]) can[t] = true;
  }
}

const fullest = can.lastIndexOf(true);
// fullest is 9: the weights 4 and 5
```

## Why it works

- `can[t - w]` means: the total `t - w` was reachable before. Take `w` as well and you reach `t`.
- Going down, `can[t - w]` is still the value from before this item. Going up, it could already include `w`, and `w` would be used twice.
- `can[0] = true` is the base case: an empty bag weighs 0.

## When to use it

- You choose a subset, and each item can be used at most once.
- The goal is about the sum: reach a target, fill a limit, or split into equal halves.
- The numbers are small enough for an array with one slot per total.
