# Courier Quote (medium)

`courierQuote(km, options)` should return the price of a delivery. The price is `km` times the rate, and it is never lower than the minimum.

`options` is an object that may hold `rate` and `minimum`. A missing `rate` is 2, and a missing `minimum` is 5. Both may be 0. `options` itself may be left out.

The code below gets some of these calls wrong. Fix it.

Example 1: courierQuote(10)  ->  20
Example 2: courierQuote(1)  ->  5
Example 3: courierQuote(10, { rate: 3 })  ->  30
Example 4: courierQuote(1, { minimum: 0 })  ->  2
