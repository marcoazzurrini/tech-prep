Write `retryWithDelays(fn, delays)`. `fn` is a function that returns a promise. `delays` is an array of waits in milliseconds.

Call `fn`. If it fails, wait `delays[0]` ms and call it again. If that fails, wait `delays[1]` ms, and so on. So `fn` is called at most `delays.length + 1` times. Return a promise of the first success, or reject with the last error.

Example 1: retryWithDelays(upAfter(20), [45])  ->  "up"
Example 2: retryWithDelays(upAfter(40), [10])  ->  rejects with the error "down"

Note: `upAfter(ms)` is a helper for the tests, at the top of the file. It makes a task that fails until `ms` have passed.
