# Spam Guard (medium)

A chat server must not let one user post more than once every `ms` milliseconds.

Write `spamGuard(post, ms)`. It returns a function `send(user, text)`:

- When `user` has had no post accepted in the last `ms` milliseconds, call `post(user, text)` and return `true`.
- Otherwise, drop the message and return `false`.

Each user has their own wait. A post by one user never blocks another user.

The file also exports `wait(ms)`, for the tests.

Example 1:
  const send = spamGuard(post, 20);
  send("ann", "hi")  ->  true, and post("ann", "hi") is called
  send("ann", "hey")  ->  false
  send("bob", "yo")  ->  true
