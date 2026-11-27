`reduce(list, reducer, start)` should work like `list.reduce(reducer, start)`. When the call leaves out `start`, the first item is the start, and an empty list throws a `TypeError`.

The code below treats `undefined` passed as the start as if no start was given. Fix it.

Example 1: reduce([1, 2], (a, b) => a + b)  ->  3
Example 2: reduce(["a", "b"], (a, b) => a + b, undefined)  ->  "undefinedab"
Example 3: reduce([], (a, b) => a + b)  // throws a TypeError
