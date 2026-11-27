# Recently Used Cache (medium)

Write `createLruCache(limit)`. It returns a cache that holds at most `limit` entries, with three methods:

- `set(key, value)` stores `value` under `key`, or updates it.
- `get(key)` returns the value under `key`, or `null` when the key is not there.
- `size()` returns how many entries the cache holds.

Both `set` and a successful `get` count as a use of that key. When a new key would go over the limit, first remove the key that was used least recently.

Example 1:
  const c = createLruCache(2);
  c.set("a", 1);
  c.set("b", 2);
  c.get("a");
  c.set("c", 3);
  [c.get("a"), c.get("b"), c.get("c")]  ->  [1, null, 3]
