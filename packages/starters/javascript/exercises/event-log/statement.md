# Event Log (medium)

Write `EventLog`. `new EventLog()` makes an empty log.

- `add(text)` records a text and returns the log, so calls can be chained.
- `size()` returns how many texts the log holds.
- `last()` returns the newest text, or `null` when the log is empty.

A log has exactly one property of its own: `entries`, the array of texts. All logs share the same three functions. A `for...in` loop over a log sees `entries` and nothing else.

`EventLog()` without `new` throws a `TypeError`.

Example 1:
  const log = new EventLog();
  log.add("start").add("stop");
  log.size()  ->  2
  log.last()  ->  "stop"
  log.entries  ->  ["start", "stop"]
