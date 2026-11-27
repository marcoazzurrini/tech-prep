# Work in Slices (medium)

Write `runInSlices(items, size, handle, done)`. It calls `handle(item)` for every item, in order. It never handles more than `size` items in one go, so that other waiting code gets a turn in between.

The first `size` items are handled during the call. Each next group of `size` items is handled later, in a task of its own. When every item has been handled, it calls `done()` once.

Example 1:
  runInSlices([1, 2, 3, 4, 5], 2, handle, done)
  handles 1 and 2 during the call, then 3 and 4 in a later task, then 5 in another one, then calls done()
Example 2:
  runInSlices([], 3, handle, done)
  calls done() during the call
