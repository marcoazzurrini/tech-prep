# Scoped Metadata (medium)

Write `createStore()`. It returns an object with two methods:

- `setMeta(target, value)` attaches `value` to `target` without adding any string key and without showing up in `Object.keys(target)`, `for...in` or `JSON.stringify(target)`.
- `getMeta(target)` returns the value this store attached to `target`, or `undefined` if none was attached.

Two stores created by `createStore()` must not overwrite each other on the same `target`. A shallow copy made with `{ ...target }` must keep the metadata.

Example 1:
  const s = createStore();
  const item = { name: "book" };
  s.setMeta(item, "draft");
  s.getMeta(item)  ->  "draft"
  Object.keys(item)  ->  ["name"]

Example 2:
  const s1 = createStore();
  const s2 = createStore();
  const item = {};
  s1.setMeta(item, 1);
  s2.setMeta(item, 2);
  [s1.getMeta(item), s2.getMeta(item)]  ->  [1, 2]
