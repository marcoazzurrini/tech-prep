# Pair Adds Up to Target (medium)

Write `findPair(numbers, target)`. It returns the indexes `[i, j]` of two different items that add up to `target`, with `i` smaller than `j`. If no pair adds up, it returns `null`.

When several pairs work, return the one with the smallest `j`. If that still leaves a choice, take the smallest `i`.

Example 1: findPair([2, 7, 11, 15], 9)  ->  [0, 1]
Example 2: findPair([4, 2, 6, 2], 4)  ->  [1, 3]
Example 3: findPair([4, 1], 8)  ->  null

Constraints: The list can hold 100000 numbers, so visit each item only a few times.
