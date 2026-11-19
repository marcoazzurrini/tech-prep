# Time Based Key-Value Store (medium)

Implement a class `TimeMap`. It stores several values for the same key, each with a timestamp. It can return the value a key had at a given time.
- `TimeMap()`: creates an empty store.
- `set(key, value, timestamp)`: stores `value` for `key` at the time `timestamp`.
- `get(key, timestamp)`: returns the value that was set for `key` at the latest time that is at most `timestamp`. If there is no such value, it returns `""`.

For one key, every call to `set` has a larger `timestamp` than the call before.

Example:
  ops  = ["TimeMap", "set", "get", "get", "set", "get", "get"]
  args = [[], ["foo", "bar", 1], ["foo", 1], ["foo", 3], ["foo", "bar2", 4], ["foo", 4], ["foo", 5]]
  ->     [null, null, "bar", "bar", null, "bar2", "bar2"]

Constraints: 1 <= len(key), len(value) <= 100, 1 <= timestamp <= 10^7, at most 2 * 10^5 calls.
Follow-up: make `get` O(log n) for a key with n values.
