`largest(amounts)` takes an array that mixes BigInts and numbers. It should return the largest value, unchanged: a BigInt stays a BigInt, and a number stays a number.

The code below throws a `TypeError`. Fix it.

Example 1: largest([3n, 10n, 7n])  ->  10n
Example 2: largest([3n, 10, 7n])  ->  10
Example 3: largest([2, 9n, 4])  ->  9n
