# Awaitable Slot (hard)

A slot holds a value that arrives later. Write a class `Slot`.

- `new Slot()` makes an empty slot. `slot.fill(value)` puts a value in it, and `slot.fail(error)` puts an error in it. Only the first of these calls counts.
- `slot.then(onFilled, onFailed)` returns a new slot. Once the slot has a value, `onFilled(value)` runs. Once it has an error, `onFailed(error)` runs. They always run later, never during the call of `then` or `fill`.
- What the callback returns fills the new slot, and a `throw` makes it fail. If the callback is missing, the new slot gets the same value or error. If the callback returns an object with a `then` method, the new slot waits for it and takes its result.
- `await slot` must give the value, or throw the error.

Example 1: const s = new Slot(); setTimeout(() => s.fill(3), 5); await s.then((n) => n * 2)  ->  6
Example 2: const s = new Slot(); s.fill(1); s.fill(2); await s  ->  1

Note: do not use `Promise` inside your class. `wait` is a helper for the tests, at the top of the file.
