Write `hasInChain(obj, proto)`. It returns `true` when `proto` is on the prototype chain of `obj`, and `false` when it is not.

The chain starts at the prototype of `obj`, so `obj` itself does not count. A primitive has no chain.

Example 1: hasInChain([1, 2], Array.prototype)  ->  true
Example 2: hasInChain([1, 2], Object.prototype)  ->  true
Example 3: hasInChain(Object.create(null), Object.prototype)  ->  false
Example 4: hasInChain("text", String.prototype)  ->  false
