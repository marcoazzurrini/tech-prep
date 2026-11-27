# Chunk a Stream (medium)

Write `chunk(source, size)`. It returns an iterator that gives the values of `source` in arrays of `size` values. The last array may be shorter. It never gives an empty array.

`source` can be any iterable, even one that never ends. Read from `source` only when a value is asked for, and only as far as you need.

Example 1: [...chunk([1, 2, 3, 4, 5], 2)]  ->  [[1, 2], [3, 4], [5]]
Example 2: chunk(naturals(), 3).next().value  ->  [1, 2, 3]
Example 3: [...chunk([], 2)]  ->  []

Here `naturals()` is an endless generator of 1, 2, 3 and so on.

Note: Solve it without iterator helpers.
