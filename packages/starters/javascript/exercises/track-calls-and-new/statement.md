# Track Calls and New (medium)

Write `track(fn, log)`. It returns a stand-in for the function or class `fn`. Each call of the stand-in pushes `"call"` to the array `log`, and each `new` pushes `"new"`. Then it does what `fn` would do and gives the same result.

In every other way it looks like `fn`: the same `name`, the same `length`, the same static properties. An object made with `new` is an instance of `fn`. Calling a class without `new` still throws.

Example 1:
  const log = [];
  const add = track((a, b) => a + b, log);
  add(2, 3)  ->  5, and log is ["call"]
Example 2: track(function hi(name) {}, []).name  ->  "hi"
