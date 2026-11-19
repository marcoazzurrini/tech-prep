# Distinct Picks (easy)

Given a list `nums` that may contain equal numbers, return every distinct way to pick exactly `size` items from it. Two picks are the same if they hold the same numbers the same number of times. Each distinct pick must appear once. Return the picks, and the numbers inside each one, in any order.

Example 1: nums = [1, 1, 2], size = 2  ->  [[1, 1], [1, 2]]
Example 2: nums = [5, 5, 5], size = 2  ->  [[5, 5]]
Example 3: nums = [1, 2, 3], size = 2  ->  [[1, 2], [1, 3], [2, 3]]

Constraints: 1 <= size <= len(nums) <= 10, 0 <= nums[i] <= 20.
