# Memoize by Identity (medium)

Write `memoize(fn)`. It returns a function that gives the same results as `fn`, with the same `this`. It runs `fn` only once for each list of arguments.

Two calls share a result when they have the same number of arguments, and the arguments match one by one, the way a `Map` matches keys. So an object matches only the very same object, never a copy with the same content. `NaN` matches `NaN`.

Example 1:
  const f = memoize((a, b) => a + b);
  f(1, 2); f(1, 2)  ->  fn runs once
  f(2, 1)  ->  fn runs again
Example 2:
  const user = { id: 7 };
  f(user); f(user)  ->  fn runs once
  f({ id: 7 })  ->  fn runs again
Example 3: f(1) and f(1, undefined)  ->  fn runs twice

Note: a result can be any value, even `undefined`.
