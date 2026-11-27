# Inbox That Waits (medium)

Write `createInbox()`. It returns an inbox with two methods.

- `put(item)` adds an item.
- `take()` returns a promise of the oldest item, and removes it. When the inbox is empty, the promise waits for the next `put`.

When several `take` calls are waiting, the first `take` gets the first item put in, and so on. Each item goes to exactly one `take`.

Example 1:
  const box = createInbox();
  const next = box.take();
  box.put("b");
  next is a promise of "b".
