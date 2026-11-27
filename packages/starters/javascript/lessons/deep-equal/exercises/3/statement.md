Write `sameReadings(a, b)`. It returns `true` when two sensor logs are deeply equal. A log holds numbers, strings, arrays and plain objects.

Here a `NaN` matches a `NaN`, and `0` matches `-0`. An array never matches an object that is not an array.

Example 1: sameReadings({ temp: [NaN, 4] }, { temp: [NaN, 4] })  ->  true
Example 2: sameReadings([0], [-0])  ->  true
Example 3: sameReadings([1], { 0: 1 })  ->  false
