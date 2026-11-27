`compose(...fns)` should return a function that runs the functions from right to left. The last function gets the value first, and each function before it gets the result of the one after it.

The code below runs them from left to right. Fix it.

Example 1: compose((n) => n * 2, (n) => n + 10)(5)  ->  30
Example 2: compose((s) => s + "!", (s) => s.toUpperCase())("hi")  ->  "HI!"
Example 3: compose()(7)  ->  7
