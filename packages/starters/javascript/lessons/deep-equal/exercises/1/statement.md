`sameOrder(a, b)` should return `true` when two orders are deeply equal. An order holds strings, numbers and nested plain objects.

The code below says that two nested objects differ even when they match. Fix it.

Example 1: sameOrder({ id: 1, ship: { city: "Oslo" } }, { id: 1, ship: { city: "Oslo" } })  ->  true
Example 2: sameOrder({ id: 1 }, { id: 2 })  ->  false
Example 3: sameOrder({ id: 1 }, { id: 1, gift: true })  ->  false
