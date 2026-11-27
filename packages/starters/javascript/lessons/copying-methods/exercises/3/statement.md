Write `replaceAt(list, index, value)`. It returns a new array where the item at `index` is `value`. A negative `index` counts from the end.

When `index` is outside the array, return a copy of `list` with nothing changed. Never change `list`.

Example 1: replaceAt(["a", "b", "c"], 1, "x")  ->  ["a", "x", "c"]
Example 2: replaceAt(["a", "b", "c"], -1, "z")  ->  ["a", "b", "z"]
Example 3: replaceAt([1, 2], 5, 9)  ->  [1, 2]
