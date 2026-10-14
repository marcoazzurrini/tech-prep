# Longest Consecutive Sequence (medium)

Given an unsorted integer array `nums`, return the length of the longest run of consecutive integers (like 4, 5, 6, 7) whose values all appear in `nums`. The values can appear anywhere in the array; duplicates count once.

Example 1: nums = [100, 4, 200, 1, 3, 2]  ->  4 (the run 1, 2, 3, 4)
Example 2: nums = [0, 3, 7, 2, 5, 8, 4, 6, 0, 1]  ->  9 (0 through 8)
Example 3: nums = []  ->  0

Constraints: 0 <= len(nums) <= 10^5, -10^9 <= nums[i] <= 10^9.
Follow-up: can you do it in O(n) time, without sorting?
