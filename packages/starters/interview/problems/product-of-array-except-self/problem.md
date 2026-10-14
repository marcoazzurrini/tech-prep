# Product of Array Except Self (medium)

Given an integer array `nums`, return an array `answer` where `answer[i]` is the product of every element of `nums` except `nums[i]`. Do it in O(n) time without using division.

Example 1: nums = [1, 2, 3, 4]  ->  [24, 12, 8, 6]
Example 2: nums = [-1, 1, 0, -3, 3]  ->  [0, 0, 9, 0, 0] (only the 0 itself sees a non-zero product)
Example 3: nums = [2, 3]  ->  [3, 2]

Constraints: 2 <= len(nums) <= 10^5, -30 <= nums[i] <= 30, every product fits in a 32-bit integer.
Follow-up: can you use O(1) extra space (the output array does not count)?
