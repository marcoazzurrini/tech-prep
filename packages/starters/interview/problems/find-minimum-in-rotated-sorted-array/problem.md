# Find Minimum in Rotated Sorted Array (medium)

An array of distinct integers was sorted in ascending order, then rotated at an unknown pivot, e.g. [0, 1, 2, 4, 5, 6, 7] became [4, 5, 6, 7, 0, 1, 2]. Given the rotated array `nums`, return its minimum element in O(log n) time.

Example 1: nums = [3, 4, 5, 1, 2]  ->  1
Example 2: nums = [4, 5, 6, 7, 0, 1, 2]  ->  0
Example 3: nums = [11, 13, 15, 17]  ->  11   (rotated by 0 or by n)

Constraints: 1 <= len(nums) <= 5000, all values distinct.
