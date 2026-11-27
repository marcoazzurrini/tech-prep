# With a Temporary Setting (medium)

Write `withSetting(settings, key, value, task)`. It sets `settings[key]` to `value`, calls `task()` and returns what the task returned.

When the task is over, put `settings` back as it was. Restore the old value, or remove the key if `settings` did not have it. Do this also when the task throws, and let the error reach the caller.

Example 1:
  const s = { theme: "light" };
  withSetting(s, "theme", "dark", () => s.theme)  ->  "dark", and s.theme is "light" again
Example 2:
  const s = {};
  withSetting(s, "debug", true, () => 1)  ->  1, and s is {} again
