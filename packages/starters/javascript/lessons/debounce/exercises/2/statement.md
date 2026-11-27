`debounce(fn, ms)` should call `fn` with the arguments of the last call, and with the same `this`. Then it works for methods too.

The code below passes neither. Fix it.

Example 1:
  const add = debounce((a, b) => console.log(a + b), 20);
  add(1, 2); add(3, 4)
  prints 7
Example 2:
  const cart = { id: "c1", save: debounce(function () { console.log(this.id); }, 20) };
  cart.save()
  prints c1
