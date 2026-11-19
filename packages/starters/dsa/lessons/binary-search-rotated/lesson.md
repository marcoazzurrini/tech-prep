# Search in Rotated Order

A rotated sorted array is a sorted array with its front part moved to the back, such as `[40, 50, 60, 10, 20, 30]`. It has one drop, from `60` to `10`. Pick any `mid`: the drop is on one side only, so the other side is sorted. Use the sorted side to decide where to search.

## Worked example

One step of a search for `20`: find the sorted half, then pick the half to keep.

```ts
const nums = [40, 50, 60, 10, 20, 30];
const target = 20;
let lo = 0;
let hi = nums.length - 1;
const mid = Math.floor((lo + hi) / 2); // 2

const leftSorted = nums[lo] <= nums[mid]; // 40 <= 60: true
const inLeft = nums[lo] <= target && target < nums[mid]; // 40 <= 20: false

if (leftSorted && inLeft) hi = mid - 1;
else lo = mid + 1;

// lo: 3, hi: 5. The search goes on in [10, 20, 30].
```

## Why it works

- `nums[lo] <= nums[mid]` means there is no drop between `lo` and `mid`. That half is sorted.
- In a sorted half, a range check is safe: the target is inside only if it lies between the two ends.
- If the target is not in the sorted half, it can only be in the other half.

## When to use it

- The task says "rotated", "shifted" or "wraps around", and the data was sorted before.
- The task asks for O(log n) time, but the array is not fully sorted.
- You search for a value, or for the point where the order breaks.
