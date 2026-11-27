Write `list(item)`. It starts a chain of calls. Each later call with an item adds that item. A call with no argument ends the chain, and returns every item in order, in an array.

Each call returns a new function, so one chain can branch into two.

Example 1: list("tea")("jam")("milk")()  ->  ["tea", "jam", "milk"]
Example 2:
  const start = list("x");
  start("y")()  ->  ["x", "y"]
  start("z")()  ->  ["x", "z"]
