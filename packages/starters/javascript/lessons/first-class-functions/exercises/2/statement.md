Write `countWhere(items, test)`. `test` is a callback: a function that takes one item and returns `true` or `false`.

Call `test` once for each item, in order. Return how many items it said `true` for.

Example 1: countWhere([3, 8, 12], (n) => n > 5)  ->  2
Example 2: countWhere([], (n) => true)  ->  0
