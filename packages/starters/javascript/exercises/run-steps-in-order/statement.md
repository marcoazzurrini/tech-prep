# Run Steps in Order (medium)

Write `runInOrder(steps, done)`. Each step is a function that takes a callback `next`. A step does its work, maybe later, and then calls `next()`.

Run the steps one after another: start a step only when the step before it has called `next()`. After the last step, call `done()`. With no steps, call `done()` at once.

The file also exports `step` and `wait`, for the tests. `step(log, name, ms)` makes a step that waits `ms`, pushes `name` into `log`, then calls `next()`.

Example 1:
  runInOrder([step(log, "a", 30), step(log, "b", 0)], done)
  log becomes ["a", "b"], then done() is called
Example 2: runInOrder([], done)  ->  calls done() at once
