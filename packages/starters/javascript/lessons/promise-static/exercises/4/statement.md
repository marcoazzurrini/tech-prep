Write `createGate()`. It returns an object with two parts:

- `opened`: a promise.
- `open(value)`: a function that fulfils `opened` with `value`.

Only the first call of `open` counts.

Example 1:
  const gate = createGate();
  setTimeout(() => gate.open(5), 10);
  gate.opened is a promise of 5, after 10 ms.
