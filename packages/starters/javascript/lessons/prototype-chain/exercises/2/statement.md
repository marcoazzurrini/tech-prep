Write `chainLength(obj)`. It returns how many objects are above `obj` on its prototype chain. Do not count `null`.

Example 1: chainLength({})  ->  1
Example 2: chainLength(Object.create({}))  ->  2
Example 3: chainLength(Object.prototype)  ->  0
