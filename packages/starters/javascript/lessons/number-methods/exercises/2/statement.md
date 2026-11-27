`formatAmount(amount, digits)` should return the amount as text with `digits` decimals. A half, as the amount is written, must round up.

The code below gives `"1.00"` for `formatAmount(1.005, 2)`. Fix it.

Example 1: formatAmount(1.005, 2)  ->  "1.01"
Example 2: formatAmount(1.45, 1)  ->  "1.5"
Example 3: formatAmount(7, 2)  ->  "7.00"

Note: the amount is never negative, and never written in the `e` form.
