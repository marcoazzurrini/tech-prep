# Ask Once (medium)

Some functions are slow, so their answers are worth keeping. Write `askOnce(fn, key)`. It returns what `fn(key)` returns, and it calls `fn` at most once for each key.

Keep the answers on the function itself, in an object called `answers`. After `askOnce(fn, 4)`, `fn.answers[4]` holds the answer for `4`. A new function has no `answers` yet. When the answer for a key is already there, return it and do not call `fn`.

`fn` never returns `undefined`. Every other answer is kept, even `null` or `0`.

Example 1:
  const double = (n) => n * 2;
  askOnce(double, 4)  ->  8, and calls double
  askOnce(double, 4)  ->  8, and does not call double
  double.answers  ->  { 4: 8 }

Note: `key` is always a number.
