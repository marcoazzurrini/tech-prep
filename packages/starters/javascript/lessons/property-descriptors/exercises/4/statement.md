`addConstant(target, name, value)` adds a constant to an object and returns the object. Nothing may change the constant afterwards.

The code below stops assignment. But the constant can still be deleted, and `Object.defineProperty` can still give it a new value. Fix it.

Example 1:
  const maths = addConstant({}, "PI", 3.14);
  delete maths.PI;  // throws a TypeError
  Object.defineProperty(maths, "PI", { value: 3 });  // throws a TypeError
  maths.PI  ->  3.14
