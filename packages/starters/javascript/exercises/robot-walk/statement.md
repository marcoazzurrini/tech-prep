# Robot Walk (easy)

Write `createRobot()`. It returns a robot that starts at position `[0, 0]` and has these methods:

- `east(steps)` raises the first number, and `west(steps)` lowers it.
- `north(steps)` raises the second number, and `south(steps)` lowers it.
- `position()` returns the position as an array of two numbers.

The four moves can follow one another in a single expression, as in the example.

Example 1: createRobot().east(2).north(3).west(1).position()  ->  [1, 3]
Example 2: createRobot().position()  ->  [0, 0]
