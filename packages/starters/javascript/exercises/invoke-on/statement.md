# Invoke On (hard)

Write `invokeOn(target, fn, ...args)`. It runs `fn` so that, inside `fn`, `this` is `target`. It passes `args` on and returns what `fn` returns.

`target` is always an object. When `invokeOn` has returned, `target` has the same properties as before.

Example 1:
  function area() { return this.width * this.height; }
  invokeOn({ width: 2, height: 3 }, area)  ->  6
Example 2:
  function add(a, b) { return this.base + a + b; }
  invokeOn({ base: 10 }, add, 1, 2)  ->  13

Note: Solve it without using any method of `fn`.
