`isWholeCount(value)` should return `true` only for a number that can count things exactly. That is a whole number, `0` or more, that is safe: no larger than `Number.MAX_SAFE_INTEGER`.

The code below also accepts the string `"3"`, the number `-1` and `2 ** 60`. Fix it.

Example 1: isWholeCount(3)  ->  true
Example 2: isWholeCount("3")  ->  false
Example 3: isWholeCount(-1)  ->  false
Example 4: isWholeCount(2 ** 60)  ->  false
