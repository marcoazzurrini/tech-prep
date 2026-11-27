`makeFunction(params, body)` should build a function from strings. `params` is an array of parameter names, and `body` is the code of the function. The function must run in strict mode.

The code below ignores the parameters and runs in sloppy mode. Fix it.

Example 1: makeFunction(["a", "b"], "return a * b;")(3, 4)  ->  12
Example 2: makeFunction([], "return this === undefined;")()  ->  true
