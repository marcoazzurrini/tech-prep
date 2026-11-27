`buildAll(Class, argLists)` should return an array with one new instance of `Class` for each array of arguments in `argLists`.

The code below calls `Class` without `new`, and a class cannot be called that way. Fix it.

Example 1: buildAll(Date, [[0], [1000]])  ->  two dates, at 0 and at 1000 milliseconds
Example 2: buildAll(Array, [[3], [1, 2]])  ->  [new Array(3), new Array(1, 2)]
