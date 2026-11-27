# Fallback Bind (medium)

Write `fallbackBind(fn, fallback)`. It returns a new function that calls `fn` with `fallback` as `this` only when called with no receiver (`this === undefined`).

When the returned function is called as a method on an object, or with `call` or `apply` and a receiver, it uses that caller's `this` instead of `fallback`. All arguments must be forwarded.

Example 1: const f = fallbackBind(function () { return this.x; }, { x: 1 }); f()  ->  1
Example 2: ({ x: 9, f }).f()  ->  9
Example 3: f.call({ x: 5 })  ->  5
