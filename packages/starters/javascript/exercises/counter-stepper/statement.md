# Stepper (medium)

`makeCounter(step)` returns a counter: an object with the numbers `step` and `count`, and a method `stepper()`.

`stepper()` should return a function. Each call of that function adds the counter's current `step` to its `count`, and returns the new count.

The code below throws a `TypeError` when the returned function is called. Fix it.

Example 1:
  const counter = makeCounter(2);
  const next = counter.stepper();
  next()  ->  2
  next()  ->  4
  counter.count  ->  4
