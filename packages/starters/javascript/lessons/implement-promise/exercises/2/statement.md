`MyPromise` below settles once. Add `then(onFulfilled, onRejected)` to it.

- When the promise is fulfilled, call `onFulfilled(value)`. When it is rejected, call `onRejected(reason)`. Skip a callback that is not a function.
- Never call back during the call of `then`. Queue the callback with `queueMicrotask`.
- While the promise is pending, keep the callbacks in a list, and queue them when it settles, in the order they were added.

`then` does not return anything yet. The next step adds that.

Example 1: a fulfilled promise of 1, then (v) => log("got " + v), then log("sync")  ->  "sync" comes before "got 1"
Example 2: a promise rejected with "no", then(onFulfilled, onRejected)  ->  only onRejected("no") runs

Note: `wait` is a helper for the tests, at the top of the file.
