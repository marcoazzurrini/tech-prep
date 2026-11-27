# Apply Steps in Order (medium)

Write `applyInOrder(start, steps)`. Each step is a function. It takes a value and returns the next value, or a promise of it.

Run the steps one after another. The first step gets `start`, and each later step gets what the one before gave. Return a promise of the last result. A step must not start before the step before it has finished, and no step runs before `applyInOrder` has returned.

The starting code has `wait(ms, value)`. It gives a promise that fulfils with `value` after `ms` milliseconds. The tests use it.

Example 1: applyInOrder(2, [(n) => n + 1, (n) => n * 10])  ->  a promise of 30
Example 2: applyInOrder(1, [(n) => wait(20, n + 1)])  ->  a promise of 2
Example 3: applyInOrder("plain", [])  ->  a promise of "plain"
