# Steps to the Key (medium)

Write `stepsToKey(obj, key)`. It returns how many steps up the prototype chain a read of `key` walks before it finds the key.

Return `0` when the key is on `obj` itself, `1` when it is on the prototype of `obj`, and so on. Return `-1` when no object on the chain has the key.

Example 1: stepsToKey({ a: 1 }, "a")  ->  0
Example 2: stepsToKey(Object.create({ a: 1 }), "a")  ->  1
Example 3: stepsToKey({ a: 1 }, "toString")  ->  1
Example 4: stepsToKey({ a: 1 }, "b")  ->  -1
