# Spy (medium)

Write `spy(fn)`. It returns a function that works like `fn`: it passes its arguments on and returns the result. It also keeps a record of its calls.

The returned function has two properties:

- `count()` returns how many times it was called.
- `calls()` returns an array with the arguments of each call. Each entry is an array.

Changing the array that `calls()` returns must not change the record.

Example 1:
  const add = spy((a, b) => a + b);
  add(1, 2)  ->  3
  add(5, 5)  ->  10
  add.count()  ->  2
  add.calls()  ->  [[1, 2], [5, 5]]
