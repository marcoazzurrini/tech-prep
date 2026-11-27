# Track Loading State (medium)

Write `withLoading(state, promise)`. It sets `state.loading` to `true` at once. It returns a promise that settles like `promise`: fulfilled with the same value, or rejected with the same error. When `promise` settles, either way, it sets `state.loading` back to `false`.

The file also exports `fulfilled`, `rejected` and `wait`, for the tests. `fulfilled(value, ms)` and `rejected(message, ms)` make promises that settle after `ms`.

Example 1:
  const state = {}; withLoading(state, fulfilled("data", 20))
  state.loading is true now, and false 20 ms later. The promise gives "data".
Example 2:
  withLoading(state, rejected("down"))  ->  a promise rejected with the same error, and state.loading is false
