# Price Watchers (medium)

`createWatcher()` returns an object that lets code watch the price of a product by its key.

- `watch(key, fn)` adds `fn` for that key and returns a `stop` function that removes it again. Watching with the same function twice on one key counts once.
- `notify(key, value)` calls each function watching `key` with `value`, and returns how many it called.
- `keysHeld()` says how many keys the object holds.

The service runs for months and sees millions of keys. The code below holds on to keys that nobody watches any more. Fix it so the object holds only keys that have at least one watcher.

Example 1:
  const w = createWatcher();
  const stop = w.watch("tea", (price) => console.log(price));
  stop();
  w.notify("cake", 4);
  w.keysHeld()  ->  0
