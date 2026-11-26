Write `recordUse(fn)`. It counts the uses of a function in a property of that function, `fn.uses`.

Each call adds 1 to `fn.uses` and returns the new count. A function that was never counted has no `uses` property yet. Its first count is 1.

Example 1:
  const save = () => {};
  recordUse(save)  ->  1
  recordUse(save)  ->  2
  save.uses  ->  2
