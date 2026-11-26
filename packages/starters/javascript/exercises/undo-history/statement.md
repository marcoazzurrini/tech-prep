# Undo History (medium)

Write `createHistory(initial)`. It holds one current value, which starts as `initial`. It returns an object with four functions:

- `get()` returns the current value.
- `set(value)` makes `value` the current value.
- `undo()` goes back to the value before and returns `true`. With no value to go back to, it changes nothing and returns `false`.
- `redo()` cancels the last `undo` and returns `true`. With nothing to redo, it returns `false`. After a `set`, there is nothing to redo.

Example 1:
  const text = createHistory("a");
  text.set("ab");
  text.set("abc");
  text.undo()  ->  true
  text.get()  ->  "ab"
  text.redo()  ->  true
  text.get()  ->  "abc"
