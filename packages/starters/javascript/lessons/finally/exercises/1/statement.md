`runLogged(log, task)` pushes `"start"` to `log`, calls `task()`, pushes `"end"` to `log` and returns what `task()` returned.

Right now, when `task()` throws, `"end"` is never pushed. Fix it. `"end"` must always be pushed, and the error must still reach the caller.

Example 1:
  const log = [];
  runLogged(log, () => 42)  ->  42, and log is ["start", "end"]
Example 2:
  const log = [];
  runLogged(log, () => { throw new Error("fail"); })
  ->  throws the error, and log is ["start", "end"]
