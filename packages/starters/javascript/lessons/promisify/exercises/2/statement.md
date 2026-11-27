Some callbacks get more than one value: `callback(null, first, second)`.

Write `promisifyMany(fn)`. Like `promisify`, it returns a function that adds an error-first callback at the end of the arguments and returns a promise. The promise fulfils with an array of every value after the error. It rejects with the error, if there is one.

Example 1: promisifyMany((a, cb) => cb(null, a, a * 2))(3)  ->  fulfils with [3, 6]
Example 2: promisifyMany((cb) => cb(null))()  ->  fulfils with []
