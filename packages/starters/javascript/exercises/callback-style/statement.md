# Callback Style (medium)

Some old code only accepts functions that take a callback. Write `callbackify(fn)`, where `fn` returns a promise.

`callbackify` returns a new function. It takes the same arguments as `fn`, plus a callback at the end. It calls `fn` with the arguments. When the promise fulfils, it calls `callback(null, value)`. When it rejects, it calls `callback(error)`.

If `fn` throws instead of returning a promise, pass that error to the callback as well. Keep `this`.

Example 1: callbackify(async (a, b) => a + b)(2, 3, cb)  ->  calls cb(null, 5)
Example 2: callbackify(async () => { throw new Error("no"); })(cb)  ->  calls cb with the error
