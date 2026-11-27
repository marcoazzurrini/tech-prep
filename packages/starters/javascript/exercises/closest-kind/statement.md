# Closest Kind (medium)

Write `closestKind(value, constructors)`. `value` may pass `instanceof` for several of the constructors in the list. Return the name of the one whose `prototype` is nearest to `value` on its prototype chain.

Return `null` when `value` is an instance of none of them.

Example 1: closestKind([1, 2], [Object, Array])  ->  "Array"
Example 2: closestKind({}, [Array, Object])  ->  "Object"
Example 3: closestKind({}, [Array])  ->  null
Example 4: closestKind(5, [Number])  ->  null
