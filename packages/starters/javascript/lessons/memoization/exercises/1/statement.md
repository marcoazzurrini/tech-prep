Write `memoize(fn)` for functions of one argument. It returns a function that gives the same results as `fn`, and runs `fn` only once for each argument.

The returned function also has a property `hits`. It counts the calls that were answered from the cache. It starts at `0`.

Example 1:
  const len = memoize((s) => s.length);
  len("tea"); len("tea"); len("jam")
  len.hits  ->  1
