# Overridden Keys (medium)

Write `overriddenKeys(obj)`. It returns the own keys of `obj` that hide a property of the same name further up its prototype chain.

Give the keys in the order `Object.keys` gives them.

Example 1: an object made from { a: 1, b: 2 }, with a = 5 and c = 3  ->  ["a"]
Example 2: overriddenKeys({ name: "Ada", toString: 1 })  ->  ["toString"]
Example 3: overriddenKeys(Object.create({ a: 1 }))  ->  []
