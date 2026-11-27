`cloneData(value)` should return a deep clone of `value`. The values are primitives, arrays and plain objects, nested to any depth.

The code below turns every array into a plain object. Fix it.

Example 1: cloneData({ tags: ["new", "sale"] })  ->  { tags: ["new", "sale"] }
Example 2: cloneData([1, [2, 3]])  ->  [1, [2, 3]]
Example 3: cloneData(null)  ->  null
