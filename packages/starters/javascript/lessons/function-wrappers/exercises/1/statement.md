Write `withFallback(fn, fallback)`. It returns a function that calls `fn` with every argument it gets, and returns the result.

When `fn` throws, the function returns `fallback` instead.

Example 1:
  const parse = withFallback(JSON.parse, null);
  parse("[1, 2]")  ->  [1, 2]
  parse("oops")  ->  null
