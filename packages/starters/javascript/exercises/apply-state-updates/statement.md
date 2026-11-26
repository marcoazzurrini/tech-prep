# Apply the Updates (medium)

A settings screen keeps one value, such as a volume. Write `applyUpdates(start, updates)`. It starts from `start`, applies every update in order, and returns the value at the end.

An update is one of two things:

- a function: call it with the current value. What it returns is the new value.
- anything else: it is the new value itself.

Example 1: applyUpdates(5, [(v) => v + 1, (v) => v * 2])  ->  12
Example 2: applyUpdates(5, [(v) => v + 1, 0, (v) => v + 10])  ->  10
Example 3: applyUpdates("off", [])  ->  "off"
