Write `retryIf(fn, times, shouldRetry)`. `fn` is a function that returns a promise. Call it, and return a promise of its first success.

When a call fails, call `shouldRetry(error)`. If it returns `true`, call `fn` again. If it returns `false`, reject at once with that error. Never call `fn` more than `times` times. After the last failure, reject with its error.

Example 1: a `fn` that fails twice with "busy", then gives 3, with times = 5  ->  3
Example 2: a `fn` that fails with "bad input", and a `shouldRetry` that returns false  ->  rejects with "bad input" after one call
