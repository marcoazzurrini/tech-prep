# Only When Changed (medium)

Write `whenChanged(fn)`. It returns a function that takes one value.

The returned function calls `fn` with the value, but only when the value is different from the value of the call before. Compare with `===`. The first call always calls `fn`.

It returns `true` when it called `fn`, and `false` when it did not.

Example 1:
  const report = whenChanged(console.log);
  report("red")  ->  true, and prints red
  report("red")  ->  false, and prints nothing
  report("blue")  ->  true, and prints blue
