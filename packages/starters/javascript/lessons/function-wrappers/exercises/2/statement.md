`logCalls(fn, log)` returns a function that works like `fn`. Before each call, it adds the arguments of that call to the array `log`.

The code below breaks when the function is used as a method. Fix it.

Example 1:
  const log = [];
  const cart = { total: 10, add: logCalls(function (n) { return this.total + n; }, log) };
  cart.add(5)  ->  15
  log  ->  [[5]]
