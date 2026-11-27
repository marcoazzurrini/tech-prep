`myNew(Ctor, ...args)` should give the same result as `new Ctor(...args)`.

It goes wrong when the constructor returns a primitive, such as `7` or `"text"`. Fix it.

Example 1: a constructor that sets `this.n = 1` and returns `7`  ->  an object whose `n` is 1
Example 2: a constructor that returns `{ n: 2 }`  ->  that object
