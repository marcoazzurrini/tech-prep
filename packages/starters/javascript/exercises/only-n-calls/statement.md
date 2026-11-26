# Only N Calls (medium)

Write `limitCalls(fn, max)`. It returns a function that works like `fn` for its first `max` calls: the same `this`, the same arguments, the same result.

After that, it does not call `fn` any more. It returns the result of the last call that ran.

Example 1:
  const next = limitCalls((n) => n * 2, 2);
  next(1)  ->  2
  next(5)  ->  10
  next(9)  ->  10

Note: when `max` is 0, `fn` never runs and the result is `undefined`.
