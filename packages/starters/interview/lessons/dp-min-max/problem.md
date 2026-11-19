# Best Add or Multiply (easy)

Start with the value `nums[0]`. Then go through the other numbers from left to right. For each number, either add it to your value or multiply your value by it.

Return the largest value you can have at the end.

Example 1: nums = [2, 3, 4] -> 24 2 * 3 = 6, then 6 * 4 = 24. Example 2: nums = [-1, 2, -3] -> 6 -1 * 2 = -2, then -2 * -3 = 6. Example 3: nums = [5] -> 5

Constraints: 1 <= len(nums) <= 12, -9 <= nums[i] <= 9.
