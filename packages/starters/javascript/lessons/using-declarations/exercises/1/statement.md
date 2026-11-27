Write `track(log, name)`. It pushes `"open <name>"` to `log` and returns a resource that `using` can dispose. Disposing it pushes `"close <name>"` to `log`.

Example 1:
  const log = [];
  { using a = track(log, "a"); log.push("work"); }
  log  ->  ["open a", "work", "close a"]
Example 2:
  const log = [];
  track(log, "x");
  log  ->  ["open x"]
