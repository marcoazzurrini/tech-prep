# Message Inbox (medium)

Write a class `Inbox`. `new Inbox()` takes no arguments. Each inbox has three properties of its own:

- `messages`, an array that starts empty.
- `unread`, a number that starts at `0`.
- `receive`, a function. `receive(text)` adds `text` to `messages`, adds 1 to `unread` and returns the new `unread`. It is handed to other code as a callback, so it must work however it is called.

All inboxes share one method, `markAllRead()`. It sets `unread` to `0` and returns how many messages were unread.

Example 1:
  const inbox = new Inbox();
  const { receive } = inbox;
  receive("Hello")  ->  1
  receive("Lunch?")  ->  2
  inbox.messages  ->  ["Hello", "Lunch?"]
  inbox.markAllRead()  ->  2
  inbox.unread  ->  0
