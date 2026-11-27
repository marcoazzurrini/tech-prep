# Batch Log Messages (medium)

Sending a log message to the server is slow, so a logger should send many messages in one go.

Write `batch(send)`. It returns a function `log(message)`. The logger collects every message logged by the code that is running now. When that code has finished, it calls `send(messages)` once, with those messages in order.

A message logged later, for example from a timer or from inside `send`, goes into a new call to `send`. When nothing was logged, `send` is never called.

Example 1:
  log("a"); log("b"); log("c")
  later: send(["a", "b", "c"]), once
Example 2:
  log(1); setTimeout(() => log(2), 30)
  later: send([1]), then send([2])
