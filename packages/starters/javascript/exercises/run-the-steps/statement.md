# Run the Steps (easy)

Write `runSteps(value, steps)`. `steps` is an array of functions. Each one takes a value and returns a value.

Call the first step with `value`. Call the next step with what the first one returned, and so on. Return what the last step returned.

With no steps, return `value`.

Example 1: runSteps(10, [(n) => n * 2, (n) => n + 1])  ->  21
Example 2: runSteps(10, [(n) => n + 1, (n) => n * 2])  ->  22
Example 3: runSteps("tea", [])  ->  "tea"
