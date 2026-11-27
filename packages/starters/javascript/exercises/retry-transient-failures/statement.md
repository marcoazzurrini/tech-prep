# Retry Transient Failures (medium)

A `TransientError` is a failure that may go away if you try again, such as a busy server. Complete `RetryError`: `new RetryError(attempts, options)` has the message `failed after <attempts> attempts`, the `name` `"RetryError"` and an `attempts` field. It keeps `options.cause` as its `cause`.

Then write `retry(task, times)`. It calls `task()` and returns the first result it gets. It calls the task at most `times` times.

- When the task throws a `TransientError`, or an error of a class that extends it, try again.
- Any other error reaches the caller at once, with no more attempts.
- When every attempt failed, throw a `RetryError` with `attempts` set to `times` and the last error as its `cause`.

Example 1: retry(() => "ok", 3)  ->  "ok"
Example 2:
  let n = 0;
  retry(() => { n += 1; if (n < 3) throw new TransientError("busy"); return n; }, 5)  ->  3
Example 3:
  retry(() => { throw new TransientError("busy"); }, 2)
  ->  throws a RetryError with attempts 2 and the message "failed after 2 attempts"
