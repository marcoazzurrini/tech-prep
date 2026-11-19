# Sliding Window Maximum (hard)

A window of `k` elements slides over `nums` from left to right, one position at a time. Return the largest value of each window, in order.

Example 1: nums = [1, 3, -1, -3, 5, 3, 6, 7], k = 3  ->  [3, 3, 5, 5, 6, 7]
Example 2: nums = [1], k = 1  ->  [1]

Constraints: 1 <= k <= len(nums) <= 10^5, -10^4 <= nums[i] <= 10^4.
Follow-up: can you do it in O(n) time?
