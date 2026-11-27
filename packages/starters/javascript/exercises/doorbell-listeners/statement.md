# Doorbell (medium)

Write a class `Doorbell`. `new Doorbell()` makes a bell that nobody listens to yet.

- `onRing(listener)` adds a function to call at each ring. It returns a function. Calling that function removes the listener again.
- `ring(who)` calls every listener with `who`, in the order they were added. It returns how many listeners it called.

`ring` is handed to other code as a callback, so it must work however it is called. Each bell has its own listeners.

Example 1:
  const bell = new Doorbell();
  const names = [];
  const stop = bell.onRing((who) => names.push(who));
  const { ring } = bell;
  ring("Ada")  ->  1
  stop();
  ring("Leo")  ->  0
  names  ->  ["Ada"]
