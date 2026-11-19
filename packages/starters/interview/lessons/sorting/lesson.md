# Sort First

Some questions are hard on a mixed-up array and easy on a sorted one. So sort first. Sorting costs O(n log n). After it, close values sit next to each other, and you only need to look at neighbours.

## Worked example

Find the smallest gap between any two numbers. After sorting, the two closest numbers are neighbours.

```ts
const nums = [30, 4, 19, 11];
const sorted = [...nums].sort((a, b) => a - b); // [4, 11, 19, 30]

let smallest = Infinity;
for (let i = 1; i < sorted.length; i++) {
  const gap = sorted[i] - sorted[i - 1];
  smallest = Math.min(smallest, gap);
}

// smallest: 7 (between 4 and 11)
```

## Why it works

- `(a, b) => a - b` sorts numbers by value. Without it, JavaScript sorts them as text.
- `[...nums]` makes a copy, so the input array stays as it was.
- The loop compares each value with the one before it. That is n - 1 checks, not every pair.

## When to use it

- The order of the input does not change the answer.
- The task is about pairs, the closest values, or the smallest and largest values.
- The slow solution compares every pair, and O(n log n) is fast enough.
