# Fill the Gaps (easy)

Write `fillGaps(row, fallback)`. Both are arrays of the same length. It returns a new array with the items of `row`. Where an item of `row` is `null`, it takes the item of `fallback` at the same index.

Every other item of `row` stays, including `0`, `""` and `false`.

Example 1: fillGaps([1, null, 3], [9, 9, 9])  ->  [1, 9, 3]
Example 2: fillGaps([0, "", null], [5, "x", false])  ->  [0, "", false]
Example 3: fillGaps([], [])  ->  []
