Write `collect(iterable)`. It returns an array with the values of `iterable`, in order.

Do the work yourself: get the iterator with `[Symbol.iterator]()` and call `next()` until `done` is `true`. Do not use `for...of`, spread or `Array.from`.

Example 1: collect("abc")  ->  ["a", "b", "c"]
Example 2: collect([3, 1, 2])  ->  [3, 1, 2]
Example 3: collect([])  ->  []
