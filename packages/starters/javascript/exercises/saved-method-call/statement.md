# Saved Call (medium)

Write `savedCall(obj, methodName, ...args)`. It returns a function. Calling that function calls the method of `obj` with that name, on `obj`, and returns its result.

The method gets `args` first, then the arguments of the later call. The returned function must work however it is called.

Example 1:
  const cart = { items: [], add(name, count) { this.items.push(name + " x" + count); return this.items.length; } };
  const addTea = savedCall(cart, "add", "tea");
  addTea(2)  ->  1
  cart.items  ->  ["tea x2"]
