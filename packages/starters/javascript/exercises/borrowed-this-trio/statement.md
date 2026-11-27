# Three Ways to Set this (medium)

Write three methods that every function gets. In the tests, `thisArg` is always an object.

- `fn.myCall(thisArg, ...args)` calls `fn` with `this` set to `thisArg` and with the arguments, and returns the result. Afterwards `thisArg` holds the same keys as before.
- `fn.myApply(thisArg, args)` does the same, with the arguments in the array `args`. When `args` is `null` or left out, it passes no arguments.
- `fn.myBind(thisArg, ...early)` returns a new function. A call to it calls `fn` with `this` set to `thisArg`, the `early` arguments first and its own after them. Called with `new`, it ignores `thisArg` and builds an object from `fn`.

Example 1: (function (n) { return this.base + n; }).myCall({ base: 10 }, 5)  ->  15
Example 2: (function (a, b) { return this.base + a + b; }).myApply({ base: 1 }, [2, 3])  ->  6
Example 3: (function (a, b) { return [this.id, a, b]; }).myBind({ id: 7 }, "x")("y")  ->  [7, "x", "y"]

Note: solve it without `call`, `apply`, `bind` and `Reflect`.
