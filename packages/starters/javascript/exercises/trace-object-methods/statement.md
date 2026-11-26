# Method Log (medium)

Write `trace(obj, names)`. `names` is a list of names of methods of `obj`. The function returns a new, empty array: the log.

From then on, each call of one of those methods first adds a line to the log, then runs as before. The line is the name of the method, then its arguments in brackets, joined with `, `.

Example 1:
  const cart = { total: 0, add(price, count) { this.total += price * count; return this.total; } };
  const log = trace(cart, ["add"]);
  cart.add(5, 2)  ->  10
  cart.add(1, 1)  ->  11
  log  ->  ["add(5, 2)", "add(1, 1)"]
