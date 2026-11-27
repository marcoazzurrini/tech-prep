# Build Buckets (easy)

Write `buildBuckets(count, items)`.

Create `count` empty arrays, one for each index from `0` to `count - 1`. Each element in `items` has a `bucket` number and a `name`. Place each `name` into its bucket array, keeping order.

Ignore any item whose `bucket` is negative or at least `count`.

Example 1: buildBuckets(3, [{ bucket: 1, name: "a" }, { bucket: 0, name: "b" }, { bucket: 1, name: "c" }])  ->  [["b"], ["a", "c"], []]
Example 2: buildBuckets(2, [{ bucket: 5, name: "x" }])  ->  [[], []]
Example 3: buildBuckets(0, [{ bucket: 0, name: "x" }])  ->  []
