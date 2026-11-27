# Merge Tables (medium)

Write `mergeTables(base, extra)`. It takes two objects and returns a new object with only the own enumerable keys of `base` and `extra`.

When both objects have the same own key, the value from `extra` wins. Keys may include `"toString"` or `"__proto__"`. Any key that was not an own key of `base` or `extra` must give `false` with the `in` operator on the result.

Example 1: mergeTables({ a: 1, b: 2 }, { b: 3, c: 4 })  ->  object with a: 1, b: 3, c: 4
Example 2: mergeTables(Object.create({ hidden: 1 }), { a: 2 })  ->  object with only a: 2
