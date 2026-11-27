`Emitter` has `on`, `off` and `emit`. Write its method `once(name, listener)`.

The listener runs on the next `emit` of that name, with its arguments, and never again. `once` returns a function that removes the listener, even before it has run.

Example 1:
  const app = new Emitter();
  app.once("ready", (ms) => console.log(`ready in ${ms} ms`));
  app.emit("ready", 40);  // prints "ready in 40 ms"
  app.emit("ready", 50);  // prints nothing
