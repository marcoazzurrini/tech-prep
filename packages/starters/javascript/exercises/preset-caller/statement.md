# Preset Caller (medium)

Write `preset(fn, target, ...fixed)`. It returns a new function that calls `fn` with `target` as its `this` and `fixed` placed before any later arguments.

When the returned function is called with `new`, it must ignore `target` and construct an instance of `fn` with the combined arguments instead, so `instance instanceof fn` is `true`.

Example 1: const f = preset(function (a, b) { return this.x + a + b; }, { x: 10 }, 2); f(3)  ->  15
Example 2: function Pair(a, b) { this.a = a; this.b = b; } const P = preset(Pair, {}, 1); new P(2)  ->  Pair { a: 1, b: 2 }

Note: Solve it without `.bind()`.
