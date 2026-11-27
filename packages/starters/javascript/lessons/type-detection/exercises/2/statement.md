Write `getTypeTag(value)`. It uses `Object.prototype.toString.call(value)` and returns just the type name in lowercase, such as `"null"`, `"array"` or `"date"`.

Example 1: getTypeTag(null)  ->  "null"
Example 2: getTypeTag(new Date())  ->  "date"
Example 3: getTypeTag([1, 2])  ->  "array"
