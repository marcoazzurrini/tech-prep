Write the generator function `take(source, n)`. It yields the first `n` values of `source`, then stops. If `source` has fewer values, it yields them all.

`source` can be endless. Read only the values you need, and not one more.

Example 1: [...take([1, 2, 3, 4], 2)]  ->  [1, 2]
Example 2: [...take("ab", 5)]  ->  ["a", "b"]
Example 3: [...take(naturals(), 3)]  ->  [1, 2, 3]

Here `naturals()` is an endless generator of 1, 2, 3 and so on.

Note: Solve it without iterator helpers.
