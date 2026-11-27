Write `isPlainObject(value)`. It returns `true` only when `value` is a plain object (created with `{}` or `Object.create(null)`), and `false` for everything else, including `null`, primitives, arrays, dates, maps, functions and custom constructor instances.

Example 1: isPlainObject({ a: 1 })  ->  true
Example 2: isPlainObject(Object.create(null))  ->  true
Example 3: isPlainObject([1, 2])  ->  false
Example 4: isPlainObject(new Date())  ->  false
