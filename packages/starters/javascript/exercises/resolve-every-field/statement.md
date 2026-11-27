# Resolve Every Field (medium)

Write `resolveFields(record)`. It takes an object whose values may be promises. It returns a promise of a new object with the same keys, where each promise is replaced by its value.

If any value rejects, the returned promise rejects with that error.

Example 1: resolveFields({ name: Promise.resolve("Ada"), age: 36 })  ->  { name: "Ada", age: 36 }
Example 2: resolveFields({})  ->  {}
