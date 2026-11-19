# Variable Sliding Window

Here the window size is not given. A rule says which windows are valid. Move the right edge one step every time. While the window breaks the rule, move the left edge. What remains is the longest valid window that ends at `right`.

## Worked example

Find the longest stretch of days with at most one rainy day. A `0` is a rainy day.

```ts
const days = [1, 1, 0, 1, 1, 0, 1];
let left = 0;
let rainy = 0;
let best = 0;

for (let right = 0; right < days.length; right++) {
  if (days[right] === 0) rainy++;
  while (rainy > 1) {
    if (days[left] === 0) rainy--;
    left++;
  }
  best = Math.max(best, right - left + 1);
}

// best: 5 (days 0 to 4)
```

## Why it works

- `rainy` is the state of the window. It changes when an item enters and when an item leaves.
- The shrink step is a `while`, not an `if`. It can take several steps to make the window valid again.
- Each index enters the window once and leaves it once. So the two loops together are O(n).

## When to use it

- The task asks for the longest or shortest substring or subarray that follows a rule.
- A window that breaks the rule stays broken when it grows. Shrinking can fix it.
- The slow solution tries every start and every end.
