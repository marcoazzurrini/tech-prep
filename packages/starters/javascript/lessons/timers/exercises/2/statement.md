`later(fn, ms)` should call `fn()` once, after `ms` milliseconds. It should also return a function `cancel`. Calling `cancel()` before the timer runs stops `fn` from running.

The code below sets the timer, but it returns nothing. Make it return `cancel`.

Example 1:
  const cancel = later(() => console.log("hi"), 10)
  prints hi after 10 ms
Example 2:
  const cancel = later(() => console.log("hi"), 10); cancel()
  prints nothing
