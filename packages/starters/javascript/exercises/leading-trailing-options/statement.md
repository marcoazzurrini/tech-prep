# Throttle with Options (medium)

Write `throttle(fn, ms, options)`. It runs `fn` at most once per interval of `ms` milliseconds, with the arguments and `this` of the call that runs. A call when no interval is running starts one.

`options` has two flags. Each is `true` when it is left out.

- `leading`: the call that starts an interval runs at once. When `false`, it does not run at once. It is kept as the latest call instead.
- `trailing`: when an interval ends, the latest call kept during it runs, and starts a new interval. When `false`, the calls during an interval are dropped.

The file also exports `wait(ms)`, for the tests.

Example 1:
  throttle(fn, 15); then calls with 1, 2, 3
  fn(1) at once, fn(3) 15 ms later
Example 2:
  throttle(fn, 15, { leading: false }); then calls with 1, 2
  only fn(2), 15 ms later
Example 3:
  throttle(fn, 15, { trailing: false }); then calls with 1, 2, 3
  only fn(1), at once
