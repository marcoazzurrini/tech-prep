Write the generator function `chainAll(...sources)`. Each source is iterable. It yields every value of the first source, then every value of the second, and so on.

Example 1: [...chainAll([1, 2], "ab", new Set([3]))]  ->  [1, 2, "a", "b", 3]
Example 2: [...chainAll([[1, 2]], [3])]  ->  [[1, 2], 3]
