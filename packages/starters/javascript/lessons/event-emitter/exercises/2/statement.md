`Emitter` has `on`, `off` and `emit`. `on` returns a function that unsubscribes the listener. `off(name, listener)` should remove that listener, and do nothing when the listener is not in the list.

The code below removes another listener when `off` cannot find the one it was given. Fix it.

Example 1:
  const bell = new Emitter();
  const ring = () => console.log("ring");
  bell.on("tap", ring);
  bell.off("tap", () => {});
  bell.emit("tap");  // prints "ring"
