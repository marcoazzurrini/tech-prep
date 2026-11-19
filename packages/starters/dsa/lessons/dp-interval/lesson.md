# Interval DP

Some tasks work on a row, and each step changes the neighbours. Solve every range of the row, from short to long. For each range, pick one element to handle on its own. That splits the range into two parts that are already solved.

## Worked example

A stick has marks where it must be cut. One cut costs the length of the piece you cut. Find the cheapest order of cuts.

```ts
const marks = [0, 2, 5, 9]; // the two ends, and cuts at 2 and 5
// cost[i][j] = cheapest way to make every cut between mark i and mark j
const cost = marks.map(() => marks.map(() => 0));

for (let width = 2; width < marks.length; width++) {
  for (let i = 0; i + width < marks.length; i++) {
    const j = i + width;
    let best = Infinity;
    for (let k = i + 1; k < j; k++) {
      best = Math.min(best, cost[i][k] + cost[k][j]);
    }
    cost[i][j] = best + marks[j] - marks[i];
  }
}

// cost[0][3] is 14: cut at 5 (cost 9), then at 2 (cost 5)
```

## Why it works

- `width` grows, so short ranges are solved before the long ranges that need them.
- `k` is the cut made first in the piece from `i` to `j`. After it, the two sides no longer touch, so their costs just add up.
- In other tasks, pick the element handled **last** instead. Choose what makes the two sides independent.

## When to use it

- The elements are in a row, and you remove, cut or merge them one at a time.
- The cost of a step depends on the neighbours at that moment, so the order matters.
- The row is short, about 300 elements or fewer.
