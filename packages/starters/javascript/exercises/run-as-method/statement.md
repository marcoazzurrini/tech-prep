# Run as a Method (medium)

Write `runAs(target, fn, ...args)`. It runs `fn` as if it were a method of the object `target`: inside `fn`, `this` is `target`. It passes the other arguments to `fn` and returns its result.

`target` must look untouched, during the run and after it. `Object.keys(this)` inside `fn` lists only the keys `target` had. No key of `target` is replaced or removed, whatever its name. This holds even when `fn` throws. The error then reaches the caller of `runAs`.

Example 1: runAs({ name: "Ada" }, function (greeting) { return `${greeting}, ${this.name}`; }, "Hi")  ->  "Hi, Ada"
Example 2: runAs({ a: 1, b: 2 }, function () { return Object.keys(this); })  ->  ["a", "b"]

Note: solve it without `call`, `apply`, `bind` and `Reflect`.
