# Join Records (easy)

Write `joinRecords(list, separator)`.

`list` may be a real array, a string, or an array-like object. Return a string of its values from `0` to `length - 1` joined by `separator`, skipping any `null` or `undefined` slots.

Example 1: joinRecords({ 0: "a", 2: "c", length: 3 }, "-")  ->  "a-c"
Example 2: joinRecords(["x", null, "y"], "/")  ->  "x/y"
Example 3: joinRecords({ tag: "only" }, ",")  ->  ""
