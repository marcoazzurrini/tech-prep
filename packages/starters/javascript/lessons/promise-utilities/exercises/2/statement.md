Write `limitTime(promise, ms, onExpire)`. It returns a promise that settles like `promise`, if `promise` settles within `ms` milliseconds.

Otherwise, once the time is up, it calls `onExpire()` and rejects with `new Error("timed out")`. When `promise` settles in time, `onExpire` must never be called, not even later.

Example 1: limitTime(later(5, "data"), 30, warn)  ->  "data", and `warn` is never called
Example 2: limitTime(later(50, "data"), 20, warn)  ->  calls `warn`, then rejects with the error "timed out"

Note: `later` and `failLater` are helpers for the tests, at the top of the file.
