# Change or Copy (medium)

Write `applyChanges(settings, changes)`. It puts every property of `changes` onto `settings`, and returns `settings`.

Some callers pass a `settings` object made with `Object.freeze`, which cannot be changed. For those, return a new object that holds the properties of both, and leave `settings` as it is. Where both have a property, the one from `changes` wins.

Example 1:
  const settings = { theme: "dark" };
  applyChanges(settings, { size: 12 }) === settings  ->  true
  settings  ->  { theme: "dark", size: 12 }
Example 2:
  const fixed = Object.freeze({ theme: "dark" });
  applyChanges(fixed, { theme: "light" })  ->  { theme: "light" }
  fixed  ->  { theme: "dark" }
