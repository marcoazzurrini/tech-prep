# Interleave Sources (medium)

Write `interleave(...sources)`. Each source is an iterable. Return an iterator that takes one value from each source in turn: the first value of every source, then the second, and so on.

When a source runs out, skip it and go on with the others. A source can be endless, so never read one to its end before you yield.

Example 1: interleave([1, 2, 3], ["a"], [true, false]).toArray()  ->  [1, "a", true, 2, false, 3]
Example 2: interleave(["x"], []).toArray()  ->  ["x"]
Example 3: interleave(naturals(), ["x"]).take(4).toArray()  ->  [0, "x", 1, 2]

Here `naturals()` is an endless generator of 0, 1, 2 and so on.
