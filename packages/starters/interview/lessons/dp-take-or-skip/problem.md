# Best Pair Products (easy)

You have a row of integers `nums`. You may pair two numbers that are next to each other. A pair earns the product of its two numbers. Each number can be in at most one pair. You may leave numbers out.

Return the largest total you can earn. With no pairs the total is `0`.

Example 1: nums = [1, 2, 3] -> 6 Pair 2 with 3. Example 2: nums = [3, 4, 5, 6] -> 42 Pair 3 with 4, and 5 with 6. Example 3: nums = [2, -3, 4] -> 0 Every pair loses points, so make no pair.

Constraints: 0 <= len(nums) <= 1000, -100 <= nums[i] <= 100.
