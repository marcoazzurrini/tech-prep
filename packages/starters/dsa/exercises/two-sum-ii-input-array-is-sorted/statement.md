# Two Sum II - Input Array Is Sorted (medium)

`numbers` is sorted from smallest to largest. Find the two elements that add up to `target`. Exactly one such pair exists.

Positions are counted from 1, not from 0. Return the two positions as `[first, second]`, with `first < second`.

Example 1: numbers = [2, 7, 11, 15], target = 9  ->  [1, 2]
Example 2: numbers = [2, 3, 4], target = 6  ->  [1, 3]
Example 3: numbers = [-1, 0], target = -1  ->  [1, 2]

Constraints: 2 <= len(numbers) <= 3 * 10^4, -1000 <= numbers[i] <= 1000. You may not use the same element twice.
Follow-up: can you use only O(1) extra space?
