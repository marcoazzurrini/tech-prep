Write `lockLevel(obj)`. It returns a string that names the strictest lock on `obj`:

- `"frozen"` if `obj` is frozen
- `"sealed"` if `obj` is sealed but not frozen
- `"fixed"` if `obj` is not extensible, and neither sealed nor frozen
- `"open"` otherwise

Example 1: lockLevel({ a: 1 })  ->  "open"
Example 2: lockLevel(Object.seal({ a: 1 }))  ->  "sealed"
Example 3: lockLevel(Object.freeze({ a: 1 }))  ->  "frozen"
Example 4: lockLevel(Object.preventExtensions({}))  ->  "frozen"
