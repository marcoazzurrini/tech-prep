`shippingCost(weight)` should return the cost of sending a parcel:

- `0` when the weight is zero or less
- `4` when the weight is under 5
- twice the weight in every other case

The code below gives `undefined` in two of these cases. Fix it.

Example 1: shippingCost(0)  ->  0
Example 2: shippingCost(2)  ->  4
Example 3: shippingCost(12)  ->  24
