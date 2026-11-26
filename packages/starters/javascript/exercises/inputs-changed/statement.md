# Inputs Changed (medium)

A screen is drawn again only when one of its inputs has changed. Write `inputsChanged(before, after)`. It takes the old array of inputs and the new one, and returns `true` when the screen must be drawn again.

The inputs have changed when the two arrays differ in length, or when a position holds another value than before.

- `NaN` that is still `NaN` has not changed.
- `0` and `-0` are two different values.
- An object has changed only when it is another object. What it holds does not matter.

Example 1: inputsChanged([1, "a"], [1, "a"])  ->  false
Example 2: inputsChanged([1, "a"], [1, "b"])  ->  true
Example 3: inputsChanged([NaN], [NaN])  ->  false
Example 4: inputsChanged([0], [-0])  ->  true
