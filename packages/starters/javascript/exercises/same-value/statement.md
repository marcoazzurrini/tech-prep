# Same Value (medium)

Write `sameValue(a, b)`. It works like `a === b`, with two changes:

- `NaN` is the same as `NaN`.
- `0` and `-0` are not the same.

Example 1: sameValue(NaN, NaN)  ->  true
Example 2: sameValue(0, -0)  ->  false
Example 3: sameValue("a", "a")  ->  true
Example 4: sameValue(1, "1")  ->  false

Note: Solve it without `Object.is`.
