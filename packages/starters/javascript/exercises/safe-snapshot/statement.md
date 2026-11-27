# Safe Snapshot (medium)

Write `safeSnapshot(data)`. It returns a deep copy of `data` whose properties cannot be added, removed or reassigned at any level.

Changing the original `data` after calling `safeSnapshot` must not change the snapshot. If `data` is a primitive or `null`, return it as it is.

Example 1:
  const state = { user: { name: "Ada" } };
  const snap = safeSnapshot(state);
  state.user.name = "Ben";
  snap.user.name  ->  "Ada"
  snap.user.name = "Eve";  // throws a TypeError

Example 2:
  safeSnapshot(null)  ->  null
