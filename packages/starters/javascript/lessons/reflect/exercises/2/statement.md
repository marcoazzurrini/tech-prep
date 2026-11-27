`removeKeys(obj, keys)` deletes each key of the array `keys` from `obj`. It returns the keys it could not delete, in order. It must never throw.

The code below throws when a key is locked, and it never fills `kept`. Fix it.

Example 1: removeKeys({ a: 1, b: 2 }, ["a"])  ->  []
Example 2: removeKeys(Object.freeze({ a: 1, b: 2 }), ["a", "b"])  ->  ["a", "b"]

Note: Solve it without `try`.
