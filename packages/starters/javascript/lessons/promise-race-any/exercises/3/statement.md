`firstAvailable(promises)` should return a promise of the first value to fulfil. It skips the promises that reject.

The code below gives up at the first rejection. Fix it.

Example 1: firstAvailable([Promise.reject(new Error("a")), Promise.resolve("b")])  ->  "b"
Example 2: firstAvailable([Promise.resolve(0), Promise.resolve(1)])  ->  0
