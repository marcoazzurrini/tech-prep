# Array Partition (easy)

`nums` holds `2n` integers. Split them into `n` pairs. Each pair scores its smaller value. Return the largest total score you can reach.

Example 1: nums = [1, 4, 3, 2]  ->  4   (pairs (1, 2) and (3, 4) score 1 + 3)
Example 2: nums = [6, 2, 6, 5, 1, 2]  ->  9   (pairs (1, 2), (2, 5), (6, 6) score 1 + 2 + 6)

Constraints: 2 <= len(nums) <= 2 * 10^4, len(nums) is even, -10^4 <= nums[i] <= 10^4.
