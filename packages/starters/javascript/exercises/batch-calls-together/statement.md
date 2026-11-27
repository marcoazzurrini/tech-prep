# Batch Calls Together (medium)

Write `batchCalls(handler)`. It returns a function `add(item)`.

`add` does not call `handler` at once. It collects the items. When the current code has finished, but before any timer runs, it calls `handler` once, with an array of every item collected, in order. Items added after that start a new batch.

In the tests, `await null` waits just long enough for a batch to be handled.

Example 1:
  const add = batchCalls((items) => console.log(items.join(",")));
  add(1); add(2); add(3);
  Prints "1,2,3" once, after the current code has finished.
