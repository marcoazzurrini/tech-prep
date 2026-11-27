Write `redactKeys(obj, hiddenKeys)`. It returns a JSON string of `obj` with every key listed in `hiddenKeys` removed at every nesting level.

Example 1: redactKeys({ user: "Ada", pin: 1234 }, ["pin"])  ->  '{"user":"Ada"}'
Example 2: redactKeys({ a: 1, nested: { pin: 9, ok: true } }, ["pin"])  ->  '{"a":1,"nested":{"ok":true}}'
