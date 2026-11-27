# Flatten Nested Lists (medium)

Write `flatten(items)`. `items` is an array, and its items can be arrays too, nested to any depth.

`flatten` returns an iterator that gives every value that is not an array, in order. A string is a single value: do not split it into characters.

Example 1: [...flatten([1, [2, [3, [4]]], 5])]  ->  [1, 2, 3, 4, 5]
Example 2: [...flatten([[], [[]], 7])]  ->  [7]
Example 3: [...flatten(["ab", ["c"]])]  ->  ["ab", "c"]

Note: Solve it without `flat`.
