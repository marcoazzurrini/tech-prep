# Debounce with Flush (medium)

Write `debounce(fn, ms)`. It returns a debounced function: `fn` runs `ms` after the last call of a burst, with the arguments and `this` of that call.

Each call of the debounced function returns the result of the last time `fn` ran, or `undefined` if it has not run yet. It also has two methods:

- `flush()` runs the waiting call at once, so it does not run again later. It returns the result of the last run. With no waiting call, it only returns the last result.
- `cancel()` drops the waiting call.

The file also exports `wait(ms)`, for the tests.

Example 1:
  const double = debounce((x) => x * 2, 20);
  double(4)  ->  undefined
  double.flush()  ->  8
  double(5)  ->  8, and 10 is ready 20 ms later
