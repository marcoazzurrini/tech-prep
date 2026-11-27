# Never Throw on Call (medium)

Write `promiseOf(fn)`. It returns a new function. The new function calls `fn` with the same arguments and the same `this`, and always returns a promise:

- when `fn` returns a value, the promise fulfils with it;
- when `fn` throws, the promise rejects with the error, and the call does not throw;
- when `fn` returns a promise, the promise settles like it.

Example 1: promiseOf((a, b) => a + b)(2, 3)  ->  a promise of 5
Example 2: promiseOf(() => { throw new Error("no"); })()  ->  a promise that rejects with "no"
