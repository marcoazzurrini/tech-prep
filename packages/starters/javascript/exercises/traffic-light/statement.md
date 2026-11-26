# Traffic Light (easy)

Finish this file. Other files import `colour` and `changes` from it, and they must always see the latest values.

- `colour` starts as `"red"`. Each call of `next()` moves it one step: red, green, amber, then red again.
- `changes` counts the calls of `next()`.
- `reset()` puts `colour` back to `"red"` and `changes` back to 0.

Example 1:
  reset()
  next()
  next()
  exports.colour  ->  "amber"
  exports.changes  ->  2

Note: a test reads `exports.colour`, which is how another file sees the export.
