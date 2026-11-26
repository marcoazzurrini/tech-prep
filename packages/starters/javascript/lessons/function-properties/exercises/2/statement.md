Write `callWhenReady(fn, args)`. It takes a function and an array of arguments.

When `args` holds at least as many values as `fn.length`, call `fn` with them and return the result. Otherwise return how many are missing, as text.

Example 1: callWhenReady((a, b) => a + b, [2, 3])  ->  5
Example 2: callWhenReady((a, b) => a + b, [2])  ->  "missing 1"
Example 3: callWhenReady(() => "ok", [])  ->  "ok"
