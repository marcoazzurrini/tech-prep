# Sequence Starts

Put the values in a set. A value starts a run only when the value just before it is missing. Walk forward from those starts only. Then each run is walked once, and the total work stays O(n).

## Worked example

Find each run of consecutive page numbers, as its first and last page.

```ts
const pages = new Set([7, 2, 11, 1, 3, 10]);
const runs: number[][] = [];

for (const page of pages) {
  if (pages.has(page - 1)) continue; // not a start

  let end = page;
  while (pages.has(end + 1)) end++;
  runs.push([page, end]);
}

// runs: [7, 7], [1, 3] and [10, 11]
```

## Why it works

- `pages.has(page - 1)` means the page is inside a run, not at its start. Skipping it stops the same run from being walked again.
- The `while` loop walks forward from a start to the end of its run.
- The outer loop sees each page once. The inner walks also see each page once in total. So the work is O(n), even with a loop inside a loop.

## When to use it

- The task says "consecutive", "run", "chain" or "streak" about values in no order, and asks for O(n). Sorting is too slow.
- Each value has one clear value before it, such as `x - 1`, that you can look up in a set.
- The order of the input does not matter. Only which values exist matters.
