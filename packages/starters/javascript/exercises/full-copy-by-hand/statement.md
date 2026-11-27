# Full Copy by Hand (medium)

Write `deepClone(value)`. It returns a deep clone of `value`: a copy that shares no object with the original.

- Primitives and functions come back as they are.
- Arrays, plain objects and class instances are copied. An object copy keeps the prototype and the symbol keys of its original.
- A `Date` copy has the same time. A `Map` copy has the same keys, with cloned values. A `Set` copy has cloned items.
- An object reached twice is copied once, and a cycle stays a cycle.

Example 1:
  const user = { name: "Ada", since: new Date(0), roles: new Set(["admin"]) };
  const copy = deepClone(user);
  copy.since.getTime()  ->  0
  copy.roles === user.roles  ->  false
Example 2:
  const node = { id: 1 };
  node.self = node;
  deepClone(node).self.self.id  ->  1

Note: solve it without `structuredClone`.
