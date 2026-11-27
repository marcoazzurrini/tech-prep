Write `Function.prototype.myBind(thisArg, ...early)`. It returns a new function that calls the original with `this` set to `thisArg`, the saved arguments first and the new arguments after them.

When the new function is called with `new`, it ignores `thisArg`. It builds an object from the original function instead, again with the saved arguments first.

Example 1:
  function Box(w, h) { this.area = w * h; }
  const Wide = Box.myBind(null, 10);
  new Wide(3).area  ->  30
  new Wide(3) instanceof Box  ->  true
