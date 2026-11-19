# Previous Equal Value (easy)

Given an integer array `nums`, return an array `prev` of the same length. `prev[i]` is the index of the closest earlier element that is equal to `nums[i]`. If no earlier element is equal, `prev[i]` is `-1`.

Example 1: nums = [5, 3, 5, 5, 3] -> [-1, -1, 0, 2, 1] Example 2: nums = [1, 2, 3] -> [-1, -1, -1] Example 3: nums = [] -> []

Constraints: 0 <= len(nums) <= 10^4, -10^9 <= nums[i] <= 10^9. Follow-up: can you do it in one pass?
