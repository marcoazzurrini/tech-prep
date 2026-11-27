# Resolve Nested Promises (hard)

A page loads its data as a tree of arrays and plain objects, with promises anywhere inside it. Write `resolveDeep(value)`.

Return a promise of the same tree, with every promise replaced by its value. A promise may fulfil with another tree that holds promises, so resolve those too. If any promise rejects, reject at once with its reason.

Example 1: resolveDeep({ user: later(20, "Ada"), tags: [later(5, "a"), "b"] })  ->  { user: "Ada", tags: ["a", "b"] }
Example 2: resolveDeep(later(5, [later(5, 1)]))  ->  [1]
Example 3: resolveDeep(7)  ->  7

Note: `later` and `failLater` are helpers for the tests, at the top of the file. Solve it without `Promise.all` and the other `Promise` combinators.
