`publicCopy(obj)` should return a new object with the own enumerable string keys of `obj` and their values. Symbol keys must stay behind.

The code below copies the symbol keys too. Fix it.

Example 1: publicCopy({ a: 1, [Symbol("s")]: 2 })  ->  { a: 1 }
Example 2: publicCopy({ a: 1, b: 2 })  ->  { a: 1, b: 2 }
