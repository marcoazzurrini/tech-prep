`knownReadings(readings)` should return a new array without the `null` and `undefined` values. Every other value stays, `0`, `""` and `false` included.

The code below drops too much. Fix it.

Example 1: knownReadings([4, 0, null, 9])  ->  [4, 0, 9]
Example 2: knownReadings([0, undefined, 3])  ->  [0, 3]
