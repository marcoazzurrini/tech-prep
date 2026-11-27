# My New Operator (medium)

Write `myNew(Ctor, ...args)`. It returns what `new Ctor(...args)` would return. `Ctor` is a constructor written with `function`.

If `Ctor.prototype` is not an object, link the new object to `Object.prototype`, as `new` does. If `Ctor` is not a function, throw a `TypeError`.

Example 1: myNew(Point, 1, 2)  ->  an object with x = 1 and y = 2, linked to Point.prototype
Example 2: a constructor that returns `{ b: 2 }`  ->  { b: 2 }
Example 3: myNew(42)  ->  throws a TypeError

Note: solve it without `new`, `Reflect.construct` or `class`.
