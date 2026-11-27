# Retry with Delay (medium)

Write `retry(fn, times, ms)`. `fn` takes the number of the attempt, starting at 1, and returns a promise or a value. It may also throw.

Call `fn` until it succeeds, at most `times` times, and wait `ms` milliseconds between two attempts. Return a promise of the first success. After the last failure, reject at once with its error, without waiting.

Example 1: retry(async (n) => "ok on " + n, 3, 10)  ->  "ok on 1"
Example 2: retry(upAfter(20), 2, 45)  ->  "up"
Example 3: retry(async (n) => { throw new Error("fail " + n); }, 3, 5)  ->  rejects with the error "fail 3"

Note: `upAfter(ms)` is a helper for the tests, at the top of the file. It makes a task that fails until `ms` have passed.
