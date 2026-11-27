# Add Async Methods (medium)

Write `addAsyncMethods(obj)`. Each method of `obj` takes an error-first callback as its last argument. For each method, add a promise version under the same name plus `Async`. Then return `obj`.

The promise version takes the other arguments, and returns a promise of the callback's value. Inside the method, `this` must be `obj`, even when the promise version is called on its own.

Only own properties whose value is a function are methods.

Example 1:
  const timer = { ms: 5, wait(label, cb) { setTimeout(cb, this.ms, null, label); } };
  addAsyncMethods(timer);
  timer.waitAsync("go")  ->  fulfils with "go"
