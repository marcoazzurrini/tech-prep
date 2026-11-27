# Mailbox Delivery (medium)

`createMailbox()` returns a mailbox with two methods. `listen(fn)` adds a listener. `send(message)` delivers the message to every listener, by calling it with the message.

Finish `send`. It must not deliver at once. It delivers after the current code has finished, but before any timer runs. So a listener added just after `send`, in the same code, still gets the message.

The tests use `await null` to wait until the microtasks queued so far have run.

Example 1:
  box.send("hi");
  box.listen((m) => console.log(m));
  Prints "hi" once the current code has finished.
