# Count by Type (easy)

Write `countByType(values)`. It takes an array and returns an object that says how many values there are of each type.

Name the types as `typeof` does, with two changes: count `null` as `"null"`, and an array as `"array"`.

Example 1: countByType([1, "a", 2, null])  ->  { number: 2, string: 1, null: 1 }
Example 2: countByType([[1], { a: 1 }])  ->  { array: 1, object: 1 }
Example 3: countByType([])  ->  {}
