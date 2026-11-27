# One-Shot Listeners (hard)

Write `createChannel()`. It returns an object with four methods:

- `on(fn)` adds a listener and returns a function that removes it.
- `once(fn)` adds a listener that runs at most once. It also returns a function that removes it, in case it never runs.
- `emit(value)` calls the listeners with `value`, in the order they were added.
- `size()` says how many listeners the channel holds.

A listener added with `once` must not be held after it has run. It runs only once, even if it calls `emit` itself. Each call to `on` or `once` adds a new listener, even with a function already added.

Example 1:
  const ch = createChannel();
  ch.once((v) => console.log(v));
  ch.emit(1);
  ch.emit(2);
  ch.size()  ->  0
