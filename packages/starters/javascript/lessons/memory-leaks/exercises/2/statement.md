`createBus()` returns an object with four methods. `on(fn)` adds a listener, and `off(fn)` removes it. `emit(value)` calls every listener with `value`. `count()` says how many listeners the bus holds.

The code below never really removes a listener, so the bus keeps every one it was given. Fix it. Adding the same function twice keeps it once.

Example 1:
  const bus = createBus();
  const show = (v) => console.log(v);
  bus.on(show);
  bus.off(show);
  bus.count()  ->  0
