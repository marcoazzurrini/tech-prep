`debounce(fn, ms)` should wait until the calls stop, then call `fn` once, `ms` after the last call, with that call's arguments.

The code below cancels a timer, but `fn` still runs for every call. Fix it.

The file also exports `wait(ms)`, for the tests.

Example 1:
  const log = debounce((x) => console.log(x), 20);
  log(1); log(2); log(3)
  prints 3, once, 20 ms after the last call
