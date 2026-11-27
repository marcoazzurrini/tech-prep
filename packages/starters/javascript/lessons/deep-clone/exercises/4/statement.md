Write `cloneInstance(value)`. It returns a deep clone of `value`, which holds primitives, arrays and objects.

Each object copy has the same prototype as its original, so class instances keep their methods. Symbol keys are copied too.

Example 1:
  class Point { constructor(x) { this.x = x; } double() { return this.x * 2; } }
  cloneInstance(new Point(4)).double()  ->  8
Example 2:
  const bare = Object.create(null);
  Object.getPrototypeOf(cloneInstance(bare))  ->  null
