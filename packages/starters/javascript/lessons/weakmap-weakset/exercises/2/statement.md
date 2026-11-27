Write `createIdTracker()`. It returns a function `idOf(obj)` that gives each object a number.

The first object passed to `idOf` gets `1`, the next new object gets `2`, and so on. The same object always gets the same number. Each tracker counts on its own.

Do not change the objects: they may be frozen. The tracker must not keep an object in memory that the rest of the program no longer uses.

Example 1:
  const idOf = createIdTracker();
  const a = {}, b = {};
  [idOf(a), idOf(b), idOf(a)]  ->  [1, 2, 1]
