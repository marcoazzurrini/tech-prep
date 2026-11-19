# Partitioning Two Sorted Arrays

You want the `k` smallest values of two sorted arrays, without merging them. Cut each array in two. The left parts together must hold `k` values. So if you take `i` values from `a`, you must take `k - i` from `b`: one cut fixes the other. The cut is right when every value on the left is at most every value on the right.

## Worked example

Check two cuts for `k = 4`.

```ts
const a = [1, 4, 7];
const b = [2, 3, 9];
const k = 4; // size of the left part

function cutIsRight(i: number): boolean {
  const j = k - i; // the cut in b follows from the cut in a
  const aLeft = a[i - 1] ?? -Infinity;
  const aRight = a[i] ?? Infinity;
  const bLeft = b[j - 1] ?? -Infinity;
  const bRight = b[j] ?? Infinity;
  return aLeft <= bRight && bLeft <= aRight;
}

// cutIsRight(1): false. The left part is [1] and [2, 3, 9], but 9 > 4.
// cutIsRight(2): true. The left part is [1, 4] and [2, 3].
```

## Why it works

- Each array is sorted. So only the four values next to the cuts need a check.
- A missing side counts as `-Infinity` or `Infinity`, so an empty part never fails a check.
- A wrong cut tells you where to go. Here `bLeft > aRight`: `a` gave too few values, so `i` must grow. That makes `i` a target for binary search.

## When to use it

- Two sorted arrays, and the task asks for the median or the k-th value of both together.
- The task asks for O(log n) time, so you cannot merge.
- Search the cut in the shorter array. Then `k - i` always fits in the other one.
