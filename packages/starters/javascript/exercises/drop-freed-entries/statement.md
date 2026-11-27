# Drop Freed Entries (medium)

A cache is a `Map` from a name to a box. A box has a method `deref()`. It gives the stored value, or `undefined` once the value has been freed from memory.

Write `dropFreed(cache)`. It deletes from the map every entry whose value has been freed. It returns the names it deleted, in alphabetical order. Names are in lower case.

Example 1:
  cache = new Map([["b", freed], ["a", freed], ["c", held]])
  dropFreed(cache)  ->  ["a", "b"], and only "c" stays

Example 2: dropFreed(new Map())  ->  []

Here `freed` is `{ deref: () => undefined }`, and `held` is a box whose `deref()` gives an object.
