# Insert at a Position (easy)

Write `insertAt(list, index, items)`. It returns a new array: `list` with all of `items` placed in it, starting at `index`. The items that were at `index` and after it move to the right.

The function must not change `list` or `items`.

Example 1: insertAt([1, 2, 5], 2, [3, 4])  ->  [1, 2, 3, 4, 5]
Example 2: insertAt(["b"], 0, ["a"])  ->  ["a", "b"]
Example 3: insertAt([1, 2], 2, [])  ->  [1, 2]

Constraints: `index` is a whole number from 0 to the length of `list`.
