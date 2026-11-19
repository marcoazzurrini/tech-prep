# Take or Skip

Go through the items one by one. For each item there are two choices: take it or skip it. Taking it has a price: a rule blocks some items near it. Keep the better of the two choices.

## Worked example

Each day offers a job with some pay. After a job you must rest for two days. Find the most money you can earn.

```ts
const pay = [5, 1, 1, 9, 4];
// best[i] = most money from the first i days
const best = new Array<number>(pay.length + 1).fill(0);

for (let i = 1; i <= pay.length; i++) {
  const skip = best[i - 1];
  const take = pay[i - 1] + best[Math.max(0, i - 3)];
  best[i] = Math.max(skip, take);
}

// best: [0, 5, 5, 5, 14, 14], so the answer is 14
```

## Why it works

- `skip` ignores today. The answer stays the same as for the days before.
- `take` adds today's pay. The two days before today must be rest days, so it builds on `best[i - 3]`.
- `Math.max(0, ...)` handles the first days, where fewer than three days exist.

## When to use it

- You pick some items from a row, for the largest or smallest total.
- Picking one item rules out other items near it.
- A greedy pick of the biggest item can block a better pair of items.
