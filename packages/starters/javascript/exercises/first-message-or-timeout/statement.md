# First Message or Timeout (medium)

`listen(handler)` registers a handler. From then on, `handler(message)` is called for every message that arrives.

Write `firstMessage(listen, ms)`. It returns a promise that is fulfilled with the first message. Later messages are ignored. If no message arrives within `ms` milliseconds, the promise is rejected with an `Error` whose message is `"no message"`.

Example 1:
  a message "hi" arrives after 10 ms, then "bye"
  firstMessage(listen, 40)  ->  a promise fulfilled with "hi"
Example 2:
  no message arrives
  firstMessage(listen, 10)  ->  a promise rejected with Error("no message"), 10 ms later
