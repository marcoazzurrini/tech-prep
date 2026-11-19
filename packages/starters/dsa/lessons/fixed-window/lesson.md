# Fixed-Size Window

The task looks at every block of `k` items in a row. Do not build each block again. Slide one window along: add the item that enters on the right, and remove the item that leaves on the left. Each step is O(1).

## Worked example

Find the largest total of 3 days in a row.

```ts
const sales = [4, 2, 7, 1, 8, 3];
const k = 3;
let sum = 0;
let best = -Infinity;

for (let i = 0; i < sales.length; i++) {
  sum += sales[i]; // enters on the right
  if (i >= k) sum -= sales[i - k]; // leaves on the left
  if (i >= k - 1) best = Math.max(best, sum); // the window is full
}

// best: 16 (7 + 1 + 8)
```

## Why it works

- Two windows next to each other share `k - 1` items. Only two items change, so only two updates are needed.
- `i - k` is the index of the item that just left the window.
- `i >= k - 1` is true once the window holds `k` items. Before that, there is nothing to check.

## When to use it

- The task says "every `k` items in a row", "substring of length `k`" or "window of size `k`".
- The length is fixed by the input. It can be the length of another string.
- The window state can be a sum or a count map. Both update in O(1) per step.
