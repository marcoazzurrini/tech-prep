# Store with Drafts (medium)

Write `createStore(initial)`. The store keeps data that no code outside it can change by accident. The data is built from plain objects, arrays and dates, nested to any depth.

It returns an object with two functions:

- `read()` returns the current data.
- `update(change)` calls `change(draft)`. The draft holds the current data, and `change` edits it in place. After that, the draft is the current data.

Three things must hold:

- Editing `initial` after the store is made does not change the store.
- Editing what `read()` returned does not change the store.
- When `change` throws, the store keeps the data it had before, and the error reaches the caller of `update`.

Example 1:
  const store = createStore({ user: { name: "Ada" } });
  store.read().user.name = "Ben";
  store.read()  ->  { user: { name: "Ada" } }
  store.update((draft) => { draft.user.name = "Cy"; });
  store.read()  ->  { user: { name: "Cy" } }
