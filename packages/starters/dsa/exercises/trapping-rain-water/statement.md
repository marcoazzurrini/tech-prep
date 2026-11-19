# Trapping Rain Water (hard)

`height[i]` is the height of a wall at position `i`. Each wall is 1 unit wide. Rain falls and fills the gaps between walls. Return how many units of water stay trapped.

Water above a position rises to the lower of two values: the tallest wall on its left and the tallest wall on its right.

Example 1: height = [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]  ->  6
Example 2: height = [4, 2, 0, 3, 2, 5]  ->  9
Example 3: height = [1, 2, 3]  ->  0   (water runs off the left side)

Constraints: 1 <= len(height) <= 2 * 10^4, 0 <= height[i] <= 10^5.
Follow-up: can you use only O(1) extra space?
