# Shared Behaviours (medium)

Write `perform(target, behaviours, name, ...args)`.

`behaviours` is an object of functions. Each one is written like a method: it reads `this`. `perform` runs the function `behaviours[name]` with `this` set to `target`, passes `args` on and returns the result.

- When `target` has a method of its own called `name`, that method runs instead.
- When neither exists, the result is `null`.
- `target` must not gain a property.

Example 1:
  const shapes = { area() { return this.width * this.height; } };
  perform({ width: 2, height: 3 }, shapes, "area")  ->  6
Example 2:
  const maths = { scale(by) { return this.size * by; } };
  perform({ size: 2 }, maths, "scale", 5)  ->  10
