# Jump Game II (medium)

You start at index 0 of an array `nums` of non-negative integers. From index `i` you may jump forward by any distance from 1 up to `nums[i]`. Return the smallest number of jumps that takes you to the last index. The last index can always be reached.

Example 1: nums = [2, 3, 1, 1, 4]  ->  2  (0 -> 1 -> 4)
Example 2: nums = [2, 3, 0, 1, 4]  ->  2
Example 3: nums = [0]  ->  0  (already at the last index)

Constraints: 1 <= len(nums) <= 10^4, 0 <= nums[i] <= 1000.
Follow-up: can you do it in O(n) time?
