# Retry a Flaky Loader (medium)

A loader sometimes fails. `load(callback)` calls `callback(error)` when it fails, or `callback(null, value)` when it works.

Write `loadWithRetry(load, tries, done)`. It calls `load`, and after a failure it calls `load` again, up to `tries` calls in all. As soon as one works, call `done(null, value)`. If all `tries` calls fail, call `done(error)` with the last error. Call `done` only once.

The file also exports `flaky` and `wait`, for the tests. `flaky(failures, value)` makes a loader that fails `failures` times, then gives `value`. Its `calls` property counts its calls.

Example 1: loadWithRetry(flaky(2, "data"), 3, done)  ->  done(null, "data") after 3 calls
Example 2: loadWithRetry(flaky(5, "data"), 3, done)  ->  done(error) after 3 calls, where error.message is "fail 3"
