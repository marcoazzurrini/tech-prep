# Load on First Use (medium)

Write `lazy(load)`. `load` is a function that returns a promise of a module's exports, such as `() => import("./chart.js")`.

`lazy` returns an async function `call(name, ...args)`. It calls the export `name` with the arguments and returns the result.

The module is loaded when `call` is first used, not before. `load` runs at most once, even when `call` is used twice before the module has arrived.

Example 1:
  const call = lazy(async () => ({ double: (n) => n * 2 }))
  await call("double", 4)  ->  8
  await call("double", 5)  ->  10
