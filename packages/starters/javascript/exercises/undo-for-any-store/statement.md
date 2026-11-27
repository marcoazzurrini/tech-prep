# Undo for Any Store (medium)

A store is a class whose instances have `get(key)` and `set(key, value)`. `MemoryStore` below is one.

Write `addUndo(Base)`. It takes a store class and returns a new class. Its instances work exactly like those of `Base`, and are instances of `Base` too. They also have `undo()`.

- `undo()` takes back the latest `set` that has not been taken back yet. The key gets the value it had before, even when that was `undefined`. It returns `true`.
- When there is nothing left to take back, `undo()` changes nothing and returns `false`.
- `set` still returns what `Base`'s `set` returns.

Each store keeps its own history, hidden from outside code. `Object.keys` of a store must not change.

Example 1:
  const store = new (addUndo(MemoryStore))();
  store.set("theme", "dark");
  store.set("theme", "light");
  store.undo()  ->  true
  store.get("theme")  ->  "dark"
  store.undo()  ->  true
  store.get("theme")  ->  undefined
  store.undo()  ->  false
