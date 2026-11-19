# Largest Value Elsewhere (easy)

Given an integer array `nums`, return an array `answer` of the same length. `answer[i]` is the largest value among all elements of `nums` except `nums[i]` itself.

Solve it in O(n) time. Walk once from the left and once from the right.

Example 1: nums = [3, 9, 4] -> [9, 4, 9] Example 2: nums = [5, 5] -> [5, 5] Example 3: nums = [-3, -1, -2] -> [-1, -2, -1]

Constraints: 2 <= len(nums) <= 10^4, -10^9 <= nums[i] <= 10^9.
