The `throttle(fn, ms)` below drops every call that comes during an interval. Add a trailing call.

Keep the latest call that comes during the interval, with its arguments and `this`. When the interval ends, run that call, and start a new interval. If no call came, nothing runs.

Example 1:
  const log = throttle((x) => console.log(x), 15);
  log(1); log(2); log(3)
  prints 1 at once, then 3 when the interval ends
