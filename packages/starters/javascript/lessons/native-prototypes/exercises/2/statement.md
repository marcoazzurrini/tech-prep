Write `chainLength(value)`. It takes an object and counts the prototypes on its chain. The `null` at the end does not count.

Example 1: chainLength({})  ->  1
Example 2: chainLength([1, 2])  ->  2
Example 3: chainLength(Object.prototype)  ->  0
