`totalOf(amounts)` adds a list of numbers. The code below rounds after every step, so small amounts can vanish.

Fix it, so the sum is rounded only once, at the end.

Example 1: totalOf([0.7, 0.1, 0.1, 0.1])  ->  1
Example 2: totalOf([1e16, 1, 1, -1e16])  ->  2

Note: the list is never empty.
