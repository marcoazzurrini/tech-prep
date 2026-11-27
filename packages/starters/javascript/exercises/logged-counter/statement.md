# Logged Counter (easy)

Write `class Counter` and `class LoggedCounter extends Counter`.

`Counter` starts at `start` (default `0`), stores it in `this.value`, and has `increment(step = 1)` (adds `step` and returns the new value), `reset()` (sets `this.value` to `0`), and static `from(start)` (returns a new instance of `this` with `start`).

`LoggedCounter` adds a `history` array starting with `[this.value]`. Its `increment(step = 1)` and `reset()` update the value and push the new value onto `this.history`. `increment` still returns the new value.

Example 1:
  const c = LoggedCounter.from(10);
  c.increment(5)  ->  15
  c.history  ->  [10, 15]

Example 2:
  const c = new LoggedCounter(2);
  c.increment();
  c.reset();
  c.history  ->  [2, 3, 0]
