Write `whichFirst(list)`. `list` is any iterable of promises and plain values.

Return a promise of the index of the first item to settle, whether it fulfils or rejects. The promise you return never rejects. A plain value counts as settled at once.

Example 1: whichFirst([later(60), later(5), later(30)])  ->  1
Example 2: whichFirst([later(40), failLater(5, "x")])  ->  1

Note: `later` and `failLater` are helpers for the tests, at the top of the file.
