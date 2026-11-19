# Running Minimum / Maximum

Scan the array once. Carry the best value seen so far in one variable. At each position, use that variable, then update it. You never look back over the earlier items.

## Worked example

For each day, store the highest temperature up to that day.

```ts
const temps = [18, 21, 19, 25, 22];
const highest: number[] = [];
let best = -Infinity;

for (const temp of temps) {
  best = Math.max(best, temp);
  highest.push(best);
}

// highest: [18, 21, 21, 25, 25]
```

## Why it works

- `best` stands for all the earlier items. One comparison replaces a second loop.
- `-Infinity` is the start value for a maximum, so the first item always wins. For a minimum, start at `Infinity`.
- The order of the two lines matters. Update first when the current item counts. Use `best` first when only earlier items count.

## When to use it

- The task says "so far", "earlier", "before" or "up to this day".
- The answer pairs each item with the best earlier item, such as the lowest earlier price.
- The slow solution looks back over all earlier items at every position.
