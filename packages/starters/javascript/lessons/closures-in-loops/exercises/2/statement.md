`makeMultipliers(count)` should return an array of `count` functions. The function at index `k` multiplies its argument by `k`.

The code below returns functions that all multiply by the same number. Fix it.

Example 1:
  const times = makeMultipliers(3);
  times[0](5)  ->  0
  times[1](5)  ->  5
  times[2](5)  ->  10
