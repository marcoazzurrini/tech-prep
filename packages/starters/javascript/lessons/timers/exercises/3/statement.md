Write `tick(times, ms, onTick)`. It calls `onTick(1)`, then `onTick(2)`, and so on up to `onTick(times)`. The calls come one every `ms` milliseconds, the first one after `ms`. Then it stops.

Example 1:
  tick(3, 10, (n) => console.log(n))
  prints 1, 2 and 3, 10 ms apart, then nothing more

Note: `times` is at least 1.
