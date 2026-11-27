# Logged Map (medium)

Write `loggedMap(map, log)`. It returns an object that works like the `Map` `map`: `get`, `set`, `has`, `delete`, `keys` and `size` all work, and changes reach `map` itself. `instanceof Map` is `true`.

Each time a method of the map is called through it, push the method's name to the array `log`. Reading `size` is not a call.

Example 1:
  const log = [];
  const m = loggedMap(new Map(), log);
  m.set("a", 1);
  m.get("a")  ->  1, and log is ["set", "get"]
Example 2: loggedMap(new Map([["a", 1]]), []).size  ->  1
