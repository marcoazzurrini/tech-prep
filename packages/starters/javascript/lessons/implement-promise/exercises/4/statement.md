`MyPromise` below chains with `then`. Finish it.

- When `resolve` gets a thenable, an object or function with a `then` method, follow it. As a microtask, call its `then` with two functions: one resolves this promise, and the other rejects it. If calling `then` throws, reject with the error.
- Once `resolve` has been called, later calls of `resolve` and `reject` change nothing, even while the promise still follows a thenable.
- A promise resolved with itself is rejected with a `TypeError`.
- Add `catch(onRejected)`, which works like `then(undefined, onRejected)`.
- Add `finally(onFinally)`. It calls `onFinally()` with no argument, and passes the value or the reason on unchanged. If `onFinally` throws, reject with that error.

Example 1: new MyPromise((resolve) => resolve(Promise.resolve("native")))  ->  fulfilled with "native"
Example 2: a promise rejected with "no", then .finally(fn)  ->  calls fn, and is rejected with "no"

Note: `wait` is a helper for the tests, at the top of the file.
