# Bounded Cache (medium)

Write `createBoundedCache(limit)`. It returns an object with four methods:

- `set(key, value)` stores `value` under `key`. If `key` already exists, update its value. If `key` is new and the cache already holds `limit` entries, remove the oldest entry first.
- `get(key)` returns the stored value for `key`, or `undefined` if not found.
- `size()` returns the number of entries currently stored.
- `clear()` removes every stored entry.

Example 1:
  const c = createBoundedCache(2);
  c.set("a", 1);
  c.set("b", 2);
  c.set("c", 3);
  [c.get("a"), c.get("b"), c.get("c")]  ->  [undefined, 2, 3]

Example 2:
  const c = createBoundedCache(2);
  c.set("a", 1);
  c.clear();
  c.size()  ->  0
