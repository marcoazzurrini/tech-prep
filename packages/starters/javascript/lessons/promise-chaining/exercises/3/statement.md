`checkout(prices)` should return a promise of the sum of the prices, plus a fee of 3. `addFee` adds the fee, after a short wait.

The code below gives a promise of `undefined`. Fix it.

Example 1: checkout([10, 20])  ->  a promise of 33
Example 2: checkout([])  ->  a promise of 3
