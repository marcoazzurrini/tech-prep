`countBroken(readings)` should return how many values in the array are `NaN`.

The code below always returns 0. Fix it.

Only the value `NaN` counts. Text and `undefined` do not.

Example 1: countBroken([1, NaN, 3, NaN])  ->  2
Example 2: countBroken([NaN, "n/a", undefined])  ->  1
Example 3: countBroken([1, 2, 3])  ->  0
