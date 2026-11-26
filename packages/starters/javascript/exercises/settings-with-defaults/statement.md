# Settings with Defaults (easy)

Write `withDefaults(settings, defaults)`. It returns a new object with every key of `defaults`.

For each key, take the value from `settings`. When `settings` holds `undefined` for the key, or does not have it, take the value from `defaults`.

A value of `null` in `settings` is a choice the user made. Keep it.

Example 1: withDefaults({ volume: 5 }, { volume: 10, theme: "dark" })  ->  { volume: 5, theme: "dark" }
Example 2: withDefaults({ theme: null }, { volume: 10, theme: "dark" })  ->  { volume: 10, theme: null }
Example 3: withDefaults({ volume: undefined }, { volume: 10 })  ->  { volume: 10 }
