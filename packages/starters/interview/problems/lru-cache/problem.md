# LRU Cache (medium)

Implement a class `LRUCache`. It stores key and value pairs, up to a fixed `capacity`. When it is full and a new key arrives, it removes the key that was used least recently. A key is "used" by `get` and by `put`.

- `LRUCache(capacity)`: creates an empty cache that holds at most `capacity` keys.
- `get(key)`: returns the value of `key`, or `-1` if the key is not in the cache.
- `put(key, value)`: stores `value` under `key`. If the key exists, it replaces the value. If the cache then holds more than `capacity` keys, it removes the least recently used key.

Both `get` and `put` must run in O(1) time on average.

Example:
  ops  = ["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"]
  args = [[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]
  ->     [null, null, null, 1, null, -1, null, -1, 3, 4]

Constraints: 1 <= capacity <= 3000, 0 <= key <= 10^4, 0 <= value <= 10^5, at most 2 * 10^5 calls.
