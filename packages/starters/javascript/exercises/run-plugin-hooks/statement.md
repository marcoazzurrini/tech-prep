# Run the Hooks (medium)

Write `runHooks(plugins, event)`. `plugins` is an array. Each entry is a plugin, or `null` or `undefined` for a plugin that failed to load. A plugin may have a `hooks` object. It maps the name of an event to a function that returns a string.

For each entry, call its hook for `event` and collect the string it returns. Use `"skipped"` for an entry that has no hook for the event. Return the collected strings, in order.

Keep what a hook returns, even an empty string.

Example 1:
  runHooks([{ hooks: { save: () => "saved" } }, null, { hooks: {} }, {}], "save")
  ->  ["saved", "skipped", "skipped", "skipped"]
