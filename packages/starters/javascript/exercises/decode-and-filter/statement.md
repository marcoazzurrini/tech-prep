# Decode and Filter (medium)

Write `decodeAndFilter(text, dropKeys)`. It takes a serialized object string `text` and an array of key names `dropKeys`.

Decode `text` into an object, remove every key listed in `dropKeys` at every nesting level, and return the remaining top-level `[key, value]` pairs sorted alphabetically by key.

Example 1:
  decodeAndFilter('{"b":2,"a":1,"secret":"x"}', ["secret"])
  ->  [["a", 1], ["b", 2]]

Example 2:
  decodeAndFilter('{"user":{"name":"Ada","pin":9},"pin":1}', ["pin"])
  ->  [["user", { name: "Ada" }]]
