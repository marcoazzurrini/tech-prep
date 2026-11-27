`runLogged(log, task)` pushes `"start"` to `log`, calls `task()`, pushes `"end"` to `log` and returns what `task()` returned.

Right now, if `task()` throws, `"end"` is never pushed. Fix it so `"end"` is always pushed while any error still climbs out.

Example 1:
  const log = [];
  runLogged(log, () => 42)  ->  42  (and log is ["start", "end"])
Example 2:
  const log = [];
  runLogged(log, () => { throw new Error("fail"); })
  ->  throws "fail" (and log is ["start", "end"])
