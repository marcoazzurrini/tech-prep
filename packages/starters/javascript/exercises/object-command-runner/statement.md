# Object Command Runner (medium)

Write `runCommands(target, commands)`. It runs each command on the object `target`, in order, and returns an array with one result for each command.

- `["get", key]` gives the value under `key`, or `null` when it is `undefined`.
- `["set", key, value]` assigns the value. It gives `true` when that worked and `false` when it did not.
- `["delete", key]` removes the key. It gives `true` or `false` in the same way.
- `["has", key]` gives whether `target` has the key, inherited keys included.
- `["keys"]` gives an array of every own key of `target`.
- Any other command gives `"unknown"`.

`runCommands` never throws, even when `target` is frozen or sealed.

Example 1: runCommands({ a: 1 }, [["get", "a"], ["set", "b", 2], ["keys"]])  ->  [1, true, ["a", "b"]]
Example 2: runCommands(Object.freeze({ a: 1 }), [["set", "a", 5], ["jump"]])  ->  [false, "unknown"]
