# Describe Value (medium)

Write `describeValue(value)`. It takes any JavaScript value and returns a lowercase label:

- `"array"` for real arrays (an object with `[Symbol.toStringTag]: "Array"` is not an array).
- `"plain-object"` for plain objects (created with `{}` or `Object.create(null)`).
- Otherwise, the lowercase built-in tag name, such as `"null"`, `"undefined"`, `"number"`, `"date"`, `"regexp"`, `"map"` or `"function"`.

Example 1: describeValue([1, 2])  ->  "array"
Example 2: describeValue({ a: 1 })  ->  "plain-object"
Example 3: describeValue(new Date())  ->  "date"
Example 4: describeValue(null)  ->  "null"
