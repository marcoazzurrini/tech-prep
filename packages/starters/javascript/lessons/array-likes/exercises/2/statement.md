Write `extractIndexed(source)`.

`source` is an array-like object. Return a real array of its values from `0` to `length - 1`, replacing any `undefined` slot with `null`.

Example 1: extractIndexed({ 0: "a", 2: "c", length: 3 })  ->  ["a", null, "c"]
Example 2: extractIndexed({ 0: "a", 1: "b" })  ->  []
