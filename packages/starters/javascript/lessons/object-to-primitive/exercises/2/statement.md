Write `makeScore(points, max)`. It returns an object that stands for a score, such as 7 out of 10.

In maths and with `+`, the object counts as its points. `String()` and a template literal give text such as `"7/10"`.

Example 1: makeScore(7, 10) * 2  ->  14
Example 2: String(makeScore(7, 10))  ->  "7/10"
Example 3: makeScore(3, 5) + makeScore(4, 5)  ->  7
