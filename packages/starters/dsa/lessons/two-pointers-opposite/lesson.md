# Opposite-End Pointers

Put one pointer at each end of a sorted array. Look at the pair they point to. Then move the one pointer whose move can still help. Each move rules out many pairs at once, so one pass is enough.

## Worked example

Count the pairs whose sum is at most 10. The array is sorted.

```ts
const nums = [1, 3, 4, 8, 9];
let left = 0;
let right = nums.length - 1;
let count = 0;

while (left < right) {
  if (nums[left] + nums[right] <= 10) {
    count += right - left; // left fits with every value up to right
    left++;
  } else {
    right--; // right is too big for every value that remains
  }
}

// count: 5
```

## Why it works

- `nums[right]` is the largest partner left. If `nums[left]` fits with it, it fits with all the smaller ones too. Count them all, then move `left`.
- `nums[left]` is the smallest partner left. If the sum is still too big, `nums[right]` fits with nothing. Drop it.
- Every step moves one pointer, so the loop runs at most n times.

## When to use it

- The input is sorted, or you may sort it, and the task is about pairs.
- The task compares the two ends and works inward, as in a mirror check.
- The slow solution tries every pair, and you want O(n) time with O(1) extra space.
