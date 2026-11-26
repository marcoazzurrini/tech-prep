Write `limitCalls(fn, max)`. It returns a function.

For its first `max` calls, the returned function passes its arguments to `fn` and returns the result. After that it does not call `fn` any more: it returns the last result again.

Example 1:
  let n = 0;
  const next = limitCalls(() => ++n, 2);
  next()  ->  1
  next()  ->  2
  next()  ->  2
