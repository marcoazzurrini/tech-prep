Write `promiseAllSettled(list)`. It works like `Promise.allSettled`. `list` is any iterable of promises and plain values.

Return a promise that waits until every item has settled, and never rejects. It fulfils with one object per item, in the order of `list`: `{ status: "fulfilled", value }` or `{ status: "rejected", reason }`. An empty list gives `[]` at once.

Example 1: promiseAllSettled([later(30, "a"), failLater(5, "b")])  ->  [{ status: "fulfilled", value: "a" }, { status: "rejected", reason: Error("b") }]
Example 2: promiseAllSettled([])  ->  []

Note: `later` and `failLater` are helpers for the tests, at the top of the file. Solve it without `Promise.allSettled`.
