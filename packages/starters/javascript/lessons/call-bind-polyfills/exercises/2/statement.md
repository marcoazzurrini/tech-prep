`fn.myApply(thisArg, args)` should work like `fn.apply(thisArg, args)` when `thisArg` is an object. When `args` is `null` or left out, it calls the function with no arguments.

The code below throws when there is no array. Fix it.

Example 1: (function () { return this.size; }).myApply({ size: 2 })  ->  2
Example 2: (function (a, b) { return this.n + a + b; }).myApply({ n: 1 }, [2, 3])  ->  6
