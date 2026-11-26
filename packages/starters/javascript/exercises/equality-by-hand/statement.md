# Equality by Hand (medium)

Write `looseEquals(a, b)`. It returns what `a == b` gives.

The two values are numbers, strings, booleans, `null` or `undefined`. They are never objects.

Example 1: looseEquals("5", 5)  ->  true
Example 2: looseEquals(null, undefined)  ->  true
Example 3: looseEquals(null, 0)  ->  false
Example 4: looseEquals("0", false)  ->  true

Note: Solve it without `==` and `!=`.
