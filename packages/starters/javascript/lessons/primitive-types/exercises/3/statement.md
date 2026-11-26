Write `typeName(value)`. It returns what `typeof` gives, with two changes: `"null"` for `null`, and `"array"` for an array.

Example 1: typeName(7)  ->  "number"
Example 2: typeName(null)  ->  "null"
Example 3: typeName([1, 2])  ->  "array"
Example 4: typeName({ a: 1 })  ->  "object"
