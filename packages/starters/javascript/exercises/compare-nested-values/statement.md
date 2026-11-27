# Compare Nested Values (medium)

Write `deepEqual(a, b)`. It returns `true` when `a` and `b` are deeply equal, and `false` otherwise.

The values hold primitives, arrays, plain objects and dates, nested to any depth.

- Two primitives are equal when `Object.is` says so.
- Two dates are equal when they hold the same time.
- An array only equals an array, and a date only equals a date.
- Two objects are equal when they have the same own keys, in any order, with deeply equal values.

Example 1: deepEqual({ a: [1, { b: 2 }] }, { a: [1, { b: 2 }] })  ->  true
Example 2: deepEqual(new Date(0), new Date(1))  ->  false
Example 3: deepEqual([], {})  ->  false
