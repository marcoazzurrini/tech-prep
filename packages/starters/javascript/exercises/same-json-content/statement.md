# Same Content (medium)

Write `sameContent(a, b)`. Each value came from JSON: it is a string, a number, a boolean, `null`, an array or a plain object. Arrays and objects can hold more arrays and objects.

Return `true` when the two values hold the same content, however deep it goes.

- Two arrays match when they have the same items in the same order.
- Two objects match when they have the same keys with the same values. The order of the keys does not matter.
- An array never matches a plain object.

Example 1: sameContent({ id: 1, tags: ["a"] }, { tags: ["a"], id: 1 })  ->  true
Example 2: sameContent([1, 2], [2, 1])  ->  false
Example 3: sameContent({ a: null }, { a: {} })  ->  false
Example 4: sameContent([], {})  ->  false
