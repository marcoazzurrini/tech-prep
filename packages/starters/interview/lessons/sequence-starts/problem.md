# Longest Doubling Chain (easy)

Given an array `nums` of different positive integers, return the length of the longest doubling chain. A doubling chain is a list of values from `nums` where each value is two times the value before it, such as `3, 6, 12`. The values can be anywhere in `nums`. A single value is a chain of length 1.

Example 1: nums = [4, 1, 2, 10, 5, 8] -> 4 The chain is `1, 2, 4, 8`. Example 2: nums = [3, 5, 7] -> 1 Example 3: nums = [] -> 0

Constraints: 0 <= len(nums) <= 10^4, 1 <= nums[i] <= 10^9, all values are different. Follow-up: can you do it in O(n) time?
