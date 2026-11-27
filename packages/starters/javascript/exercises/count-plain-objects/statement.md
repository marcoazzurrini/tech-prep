# Count Plain Objects (medium)

Write `countPlainObjects(value)`. It counts how many plain objects (created with `{}` or `Object.create(null)`) appear inside `value`, including `value` itself if it is one.

Search recursively through the own enumerable values of plain objects and the elements of arrays. Do not count arrays, `null`, primitives, `Date`, `Map`, `RegExp`, functions or custom constructor instances, and do not descend into them.

Example 1: countPlainObjects({ a: { b: 1 }, c: [new Date(), {}] })  ->  3
Example 2: countPlainObjects([1, null, new Map()])  ->  0
