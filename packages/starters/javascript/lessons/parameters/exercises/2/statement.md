`formatPrice(amount, decimals)` should return the amount as text, with that many decimals. When `decimals` is not passed, it uses 2.

The code below also uses 2 when `decimals` is `0`. Fix it.

Example 1: formatPrice(3.14159)  ->  "3.14"
Example 2: formatPrice(3.14159, 0)  ->  "3"
Example 3: formatPrice(5, 1)  ->  "5.0"
