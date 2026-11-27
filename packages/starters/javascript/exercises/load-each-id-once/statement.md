# Load Each Id Once (medium)

Write `loadAll(ids, load, limit)`. `load(id)` returns a promise of a record. The same id may appear several times in `ids`.

Call `load` once for each different id, with at most `limit` calls running at once. Start the next call as soon as one ends.

Return a promise of an array with one record for each entry of `ids`, in the same order. If a call rejects, reject with its error.

Example 1: loadAll([1, 2, 1], async (id) => id * 2, 2)  ->  [2, 4, 2], with two calls of `load`
Example 2: loadAll([], load, 2)  ->  []

Note: `tracker` and `wait` are helpers for the tests, at the top of the file.
