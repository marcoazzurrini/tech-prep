# Nearest Class (medium)

Write `nearestClass(value, classes)`. `classes` is an array of classes. Return the name of the class whose `prototype` comes first on the prototype chain of `value`.

Return `null` when none of them is on the chain. A primitive has no chain, so it always gives `null`.

Example 1: nearestClass([1, 2], [Object, Array])  ->  "Array"
Example 2: nearestClass({}, [Array])  ->  null
Example 3: nearestClass("text", [String, Object])  ->  null
