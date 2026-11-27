Write `callWith(fn, target, ...args)`. It calls `fn` with `this` set to the object `target` and with the other arguments, and returns the result.

Afterwards `target` must hold exactly the keys it held before, with the same values.

Example 1: callWith(function (n) { return this.price * n; }, { price: 3 }, 4)  ->  12

Note: solve it without `call`, `apply`, `bind` and `Reflect`.
