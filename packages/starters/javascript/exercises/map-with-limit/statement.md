# Map with Limit (medium)

Write `mapLimit(items, limit, fn)`. `fn(item, index)` returns a promise. Call it for every item, with at most `limit` calls running at once. Start the next call as soon as one ends.

Return a promise of the results, in the order of `items`. If a call rejects, reject at once with its error, and start no more calls.

Example 1: mapLimit([1, 2, 3], 2, async (n) => n * 10)  ->  [10, 20, 30]
Example 2: mapLimit([], 2, fn)  ->  []

Note: `tracker` and `wait` are helpers for the tests, at the top of the file.
