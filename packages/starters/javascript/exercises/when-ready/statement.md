# Wait Until Ready (medium)

A service takes a while to start. `check()` returns `null` while it is not ready, and some other value once it is.

Write `whenReady(check, ms, maxTries, onReady)`. It calls `check()` at once, then again every `ms` milliseconds. As soon as `check()` gives a value other than `null`, it calls `onReady(value)` and stops checking. After `maxTries` checks that all gave `null`, it stops and calls `onReady(null)`.

Example 1:
  check gives null, then null, then "ok"
  whenReady(check, 5, 10, onReady) calls check 3 times, then onReady("ok")
Example 2:
  check always gives null
  whenReady(check, 5, 3, onReady) calls check 3 times, then onReady(null)
