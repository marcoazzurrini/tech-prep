Write `sortedKeys(obj)`. It returns a view of `obj` whose key lists come in alphabetical order, the order `sort()` gives strings. `Object.keys`, `for...in` and `JSON.stringify` all use that order.

Symbol keys come after the string keys. Keys added to `obj` later show up too.

Example 1: Object.keys(sortedKeys({ b: 1, a: 2 }))  ->  ["a", "b"]
Example 2: Object.keys(sortedKeys({ 10: "x", 9: "y" }))  ->  ["10", "9"]
