# Promise from Scratch (hard)

Write a class `MyPromise` that works like `Promise`. It has a `state` (`"pending"`, `"fulfilled"` or `"rejected"`) and a `value`, which is the value or the reason.

- `new MyPromise(executor)` calls `executor(resolve, reject)` at once. The first call of `resolve` or `reject` wins. A throw in the executor rejects.
- `resolve` follows a thenable: the promise settles as the thenable does.
- `then(onFulfilled, onRejected)` returns a new promise and always calls back later. A missing callback passes the outcome on.
- `catch(onRejected)` and `finally(onFinally)` work as they do on `Promise`, except that `finally` does not wait for a promise that `onFinally` returns.
- `MyPromise.resolve(value)` and `MyPromise.reject(reason)` give a settled promise. `MyPromise.resolve` returns a `MyPromise` as it is.

Example 1: await new MyPromise((resolve) => resolve(2)).then((n) => n * 10)  ->  20
Example 2: await MyPromise.reject("no").catch((reason) => reason + " handled")  ->  "no handled"

Note: do not use `Promise` inside your class. `wait` is a helper for the tests, at the top of the file.
