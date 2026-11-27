Write `pipe(...fns)`. It returns a function that runs the functions from left to right.

The first function gets every argument of the call. Each later function gets the result of the one before it. With no functions, the returned function gives back its first argument.

Example 1: pipe((w, h) => w * h, (a) => a + " m2")(3, 4)  ->  "12 m2"
Example 2: pipe((a, b) => a + b, (n) => n * 10)(1, 2)  ->  30
Example 3: pipe()("same")  ->  "same"
