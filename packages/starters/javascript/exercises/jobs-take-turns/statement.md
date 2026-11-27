# Jobs Take Turns (medium)

Write `takeTurns()`. It returns a function `run(job)`. A job is a function that returns a value or a promise.

`run` calls the job only after every job given to it before has finished. It returns a promise of the job's result. Each call of `takeTurns()` makes its own separate line of jobs.

The starting code has `wait(ms, value)`. It gives a promise that fulfils with `value` after `ms` milliseconds. The tests use it.

Example 1:
  const run = takeTurns();
  run(() => wait(30, "slow"));
  run(() => wait(0, "fast"));
  The second job starts only when the first has finished, after 30 ms.

Note: you can assume every job succeeds.
