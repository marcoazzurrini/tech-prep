# My Promise All (medium)

Write `promiseAll(list)`. It works like `Promise.all`. `list` is any iterable of promises, thenables and plain values.

Return a promise of every value, in the order of `list`. Reject as soon as one item rejects, with its reason. An empty list gives `[]` at once. If `list` is not iterable, return a promise that rejects with a `TypeError`.

Example 1: promiseAll([later(30, "a"), later(5, "b"), "c"])  ->  ["a", "b", "c"]
Example 2: promiseAll([later(30, "a"), failLater(5, "card declined")])  ->  rejects with the error "card declined"
Example 3: promiseAll([])  ->  []

Note: `later` and `failLater` are helpers for the tests, at the top of the file. Solve it without `Promise.all`, `Promise.allSettled`, `Promise.race` or `Promise.any`.
