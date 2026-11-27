Write `createLookup(entries)`. It takes an array of `[key, value]` pairs and returns a bare object with no prototype that stores every pair.

Example 1: createLookup([["a", 1], ["__proto__", 2]])  ->  bare object with a: 1 and "__proto__": 2
Example 2: createLookup([])  ->  bare object where "toString" in obj is false
