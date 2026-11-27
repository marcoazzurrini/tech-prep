`MyPromise` below settles once and calls back later. Change `then` so that it returns a new `MyPromise`.

- When the callback runs, what it returns fulfils the new promise. If it throws, the new promise is rejected with the error.
- When the callback for the outcome is missing, the new promise gets the same outcome: the same value, or the same reason.

Example 1: new MyPromise((resolve) => resolve(2)).then((n) => n * 10)  ->  a new promise, fulfilled with 20
Example 2: a rejected promise, then((v) => v)  ->  a new promise, rejected with the same reason

Note: `wait` is a helper for the tests, at the top of the file.
