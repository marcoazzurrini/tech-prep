# Countdown with Stop (medium)

Write `countdown(from, ms, onTick, onDone)`. It counts down from `from` to 1, one step every `ms` milliseconds. The first step comes after `ms`. At each step it calls `onTick(n)`. Right after `onTick(1)`, it calls `onDone()`.

It returns a function `stop`. Calling `stop()` ends the countdown early: no more steps, and no `onDone()`.

Example 1:
  countdown(3, 10, onTick, onDone)
  calls onTick(3), onTick(2), onTick(1), then onDone()
Example 2:
  const stop = countdown(3, 10, onTick, onDone); stop()
  calls nothing

Note: `from` is at least 1.
