# Error-First Adapter (medium)

Old code expects error-first callbacks. New code gives promises. Write `toCallback(promise, callback)` to join them.

When `promise` is fulfilled, call `callback(null, value)`. When it is rejected, call `callback(error)`, with the error as the only argument. Call `callback` exactly once, and never during the call to `toCallback`.

The file also exports `fulfilled`, `rejected` and `wait`, for the tests. `fulfilled(value, ms)` and `rejected(message, ms)` make promises that settle after `ms`.

Example 1: toCallback(fulfilled(5), callback)  ->  later, callback(null, 5)
Example 2: toCallback(rejected("no tea"), callback)  ->  later, callback(error), where error.message is "no tea"
