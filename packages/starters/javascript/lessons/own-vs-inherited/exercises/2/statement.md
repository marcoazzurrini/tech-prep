Write `inheritedKeys(obj)`. It returns the keys that `for...in` visits on `obj` but that `obj` does not hold itself, in the order `for...in` visits them.

Example 1: an object made from { a: 1, b: 2 }, with c = 3  ->  ["a", "b"]
Example 2: an object made from { a: 1, b: 2 }, with a = 9  ->  ["b"]
Example 3: inheritedKeys({ x: 1, y: 2 })  ->  []
