# Fallback for One Kind (medium)

Write `onlyCatch(ErrorClass, fn, fallback)`. It returns a new function that calls `fn` with the same `this` and the same arguments, and returns its result.

When `fn` throws an error of the class `ErrorClass`, or of a class that extends it, the new function returns `fallback` instead. Anything else that `fn` throws must reach the caller unchanged.

Example 1:
  const parse = onlyCatch(SyntaxError, JSON.parse, null);
  parse("[1]")  ->  [1]
  parse("{bad")  ->  null
Example 2:
  const size = onlyCatch(RangeError, (box) => box.size, 0);
  size(null)  ->  throws the TypeError
