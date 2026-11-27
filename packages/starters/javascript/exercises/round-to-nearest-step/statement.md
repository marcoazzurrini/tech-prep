# Round to the Nearest Step (medium)

Write `roundToStep(value, step)`. It returns the multiple of `step` that is nearest to `value`.

A value exactly halfway between two multiples goes away from zero. So `12.5` goes to `15`, and `-12.5` goes to `-15`.

Example 1: roundToStep(12, 5)  ->  10
Example 2: roundToStep(12.5, 5)  ->  15
Example 3: roundToStep(-12.5, 5)  ->  -15
Example 4: roundToStep(149, 100)  ->  100

Note: `step` is always greater than 0, and the answer is never 0.
