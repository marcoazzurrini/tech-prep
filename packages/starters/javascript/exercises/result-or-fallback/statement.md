# Result or Fallback (easy)

Write `callOr(fn, fallback)`. It calls `fn` once, with no arguments, and returns what `fn` returns.

When `fn` returns nothing, `callOr` returns `fallback` instead. `null`, `0` and `""` are results, so they are returned as they are.

Example 1: callOr(() => 5, 0)  ->  5
Example 2: callOr(function () {}, "none")  ->  "none"
Example 3: callOr(() => null, "none")  ->  null
