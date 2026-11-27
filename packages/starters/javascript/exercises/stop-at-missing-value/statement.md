# Stop at a Missing Value (medium)

Write `safePipe(...fns)`. Like `pipe`, it returns a function that passes a value through each function, from left to right, and returns the last result.

But when a value is `null` or `undefined`, it stops: the functions after it do not run, and the result is `null`. This holds for the value passed in too. Other falsy values, such as `0` or `""`, go on as normal.

Example 1:
  const city = safePipe((user) => user.address, (address) => address.city);
  city({ address: { city: "Leeds" } })  ->  "Leeds"
  city({})  ->  null
Example 2: safePipe((n) => n - 1, (n) => n * 10)(1)  ->  0
Example 3: safePipe()(5)  ->  5
