`throttle(fn, ms)` should run `fn` at most once every `ms` milliseconds. The first call runs at once. Calls during the interval are dropped, and the first call after it runs at once again.

The code below runs `fn` only once, ever. Fix it.

The file also exports `wait(ms)`, for the tests.

Example 1:
  const log = throttle((x) => console.log(x), 20);
  log(1); log(2)
  prints 1 at once, and drops 2
Example 2:
  log(1), then log(2) 40 ms later
  prints 1, then 2
