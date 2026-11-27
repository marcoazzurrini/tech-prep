# Cancellable Timer (medium)

Write `startTimer(ms, value)`. It returns an object with two properties:

- `done`: a promise that is fulfilled with `value` after `ms` milliseconds.
- `cancel`: a function. Calling `cancel()` before the time is up stops the timer and rejects `done` with an `Error` whose message is `"cancelled"`.

Once `done` is fulfilled, `cancel()` changes nothing. Calling `cancel()` twice does no harm.

Example 1: await startTimer(10, "ding").done  ->  "ding", 10 ms later
Example 2:
  const timer = startTimer(10, "ding"); timer.cancel()
  timer.done is rejected with Error("cancelled")
