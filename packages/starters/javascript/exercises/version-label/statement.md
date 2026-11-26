# Version Label (medium)

Write `makeVersion(major, minor)`. It returns an object that stands for a version, such as 2.5.

- As text, and with `+`, the object reads `"2.5"`.
- In all other maths, it counts as `major * 100 + minor`.

Example 1: String(makeVersion(2, 5))  ->  "2.5"
Example 2: "v" + makeVersion(2, 5)  ->  "v2.5"
Example 3: makeVersion(2, 5) * 1  ->  205
Example 4: makeVersion(3, 0) - makeVersion(2, 5)  ->  95
