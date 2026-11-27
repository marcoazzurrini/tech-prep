# Step Range (medium)

Write `range(start, end, step)`. It returns an object that `for...of` and spread can loop over. The loop gives the numbers from `start` up to `end`, moving by `step` each time. `end` itself is never included.

`step` is 1 when it is left out. A negative `step` counts down. If `step` points away from `end`, there are no numbers.

The same range can be looped over many times, even in two loops at once.

Example 1: [...range(0, 5)]  ->  [0, 1, 2, 3, 4]
Example 2: [...range(0, 10, 3)]  ->  [0, 3, 6, 9]
Example 3: [...range(5, 0, -2)]  ->  [5, 3, 1]
Example 4: [...range(3, 1)]  ->  []

Constraints: step is never 0.
