# Set a Value at a Path (hard)

Write `setIn(data, path, value)`. `data` is built from plain objects and arrays, nested to any depth. `path` is an array of keys that leads from the top to one place: a string for a key of an object, a number for an index of an array.

It returns new data with `value` at that place. An empty path returns `value` itself.

`data` must stay as it was, at every depth. Any object or array that the path does not go through must be the same one in the result. An array stays an array.

Example 1: setIn({ user: { name: "Ada", age: 36 } }, ["user", "name"], "Ben")  ->  { user: { name: "Ben", age: 36 } }
Example 2: setIn({ rows: [[1, 2], [3, 4]] }, ["rows", 1, 0], 9)  ->  { rows: [[1, 2], [9, 4]] }
Example 3: setIn({ a: 1 }, ["b"], 2)  ->  { a: 1, b: 2 }

Constraints: every key in `path` exists in `data`, except perhaps the last one.
