`orderOfMagnitude(x)` takes a positive number. It returns the largest whole number `k` for which `10 ** k` is at or below `x`.

`Math.LN10` is `Math.log(10)`. The code below is wrong for some powers of ten. Fix it.

Example 1: orderOfMagnitude(45000)  ->  4
Example 2: orderOfMagnitude(1000)  ->  3
Example 3: orderOfMagnitude(0.5)  ->  -1
