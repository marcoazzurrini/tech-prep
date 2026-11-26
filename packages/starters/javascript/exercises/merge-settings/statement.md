# Merge Settings (medium)

Write `mergeSettings(defaults, saved)`. It returns a new settings object. A value in `saved` replaces the value with the same name in `defaults`.

Each argument may hold a `shortcuts` object. The two are merged in the same way, name by name, so a saved shortcut does not remove the default ones. The result always has a `shortcuts` object.

`saved` may be `null`. The function must not change its arguments, and changing the result later must not change them either.

Example 1: mergeSettings({ theme: "light", size: 14 }, { size: 18 })  ->  { theme: "light", size: 18, shortcuts: {} }
Example 2:
  mergeSettings({ shortcuts: { save: "s", quit: "q" } }, { shortcuts: { quit: "x" } })
  ->  { shortcuts: { save: "s", quit: "x" } }
Example 3: mergeSettings({ theme: "dark" }, null)  ->  { theme: "dark", shortcuts: {} }
