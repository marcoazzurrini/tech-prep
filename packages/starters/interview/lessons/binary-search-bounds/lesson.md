# Lower and Upper Bounds

Often the exact value is not in the array. You want a boundary: the first position where a condition becomes true. In sorted data the condition is false on the left and true on the right. Binary search finds the place where it flips.

## Worked example

Find the first grade that passes. The grades are sorted, and 60 is a pass.

```ts
const grades = [35, 48, 60, 60, 72, 90];
const pass = 60;

let lo = 0;
let hi = grades.length; // one past the end: maybe no grade passes
while (lo < hi) {
  const mid = Math.floor((lo + hi) / 2);
  if (grades[mid] >= pass) hi = mid; // passes: the first pass is here or to the left
  else lo = mid + 1; // fails: the first pass is to the right
}

// lo: 2. Two grades fail. The first pass is at index 2.
```

## Why it works

- The loop never stops early on a match. With two grades of `60`, it still moves left to the first one.
- `hi` starts at `grades.length`. If every grade fails, the answer is that index: "past the end".
- `lo` is also a count: the number of items that fail the condition.
- The item at `lo - 1` is the last one that fails. Use it for "the latest item before" questions.

## When to use it

- The task asks for the first item that is at least `x`, or the last item that is at most `x`.
- The data has duplicates, and you need the first or the last of them.
- You need to count the sorted items below or above a value.
