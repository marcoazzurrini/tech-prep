Write `keepFinite(readings)`. It takes an array of numbers and returns a new array without the ones that are `NaN`, `Infinity` or `-Infinity`.

Keep the other numbers in their order.

Example 1: keepFinite([1, Infinity, 2])  ->  [1, 2]
Example 2: keepFinite([0 / 0, 5 / 0, 5 / 2])  ->  [2.5]
Example 3: keepFinite([])  ->  []
