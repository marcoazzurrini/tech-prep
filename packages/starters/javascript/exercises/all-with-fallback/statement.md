# All with Fallback (medium)

`allWithFallback(promises, fallback)` should return a promise of every value, in input order. A promise that rejects counts as `fallback` instead. The returned promise never rejects.

The code below rejects as soon as one promise rejects. Fix it.

Example 1: allWithFallback([Promise.resolve(1), Promise.reject(new Error("x")), 3], 0)  ->  [1, 0, 3]
Example 2: allWithFallback([], "none")  ->  []
