# Message Bus (medium)

Write the class `Emitter`, with these methods.

- `on(name, listener)` adds a listener and returns a function that removes it.
- `off(name, listener)` removes that listener. It does nothing if the listener is not there.
- `once(name, listener)` adds a listener that runs one time only. It returns a function that removes it.
- `emit(name, ...args)` calls each listener of `name` with the arguments, in the order they were added. It returns `true` if there was at least one listener, and `false` if not.

A listener that is removed while `emit` runs still runs in that `emit`. A listener that is added while `emit` runs waits for the next one.

Example 1:
  const bus = new Emitter();
  const stop = bus.on("save", (file) => console.log(`saved ${file}`));
  bus.emit("save", "a.txt")  ->  true   // prints "saved a.txt"
  stop();
  bus.emit("save", "b.txt")  ->  false
