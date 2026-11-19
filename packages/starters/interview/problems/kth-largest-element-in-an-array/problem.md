# Kth Largest Element in an Array (medium)

Given an array `nums` and a number `k`, return the `k`th largest value. This is the value at position `k` when the array is sorted from largest to smallest. Equal values count separately.

Example 1: nums = [3, 2, 1, 5, 6, 4], k = 2  ->  5
Example 2: nums = [3, 2, 3, 1, 2, 4, 5, 5, 6], k = 4  ->  4  (sorted: 6, 5, 5, 4, ...)

Constraints: 1 <= k <= len(nums) <= 10^5, -10^4 <= nums[i] <= 10^4.
Follow-up: can you solve it without sorting the whole array?
