# Jump Game (medium)

You start at index 0 of an array `nums` of non-negative integers. From index `i` you may jump forward by any distance from 1 up to `nums[i]`. Return true if you can reach the last index, false otherwise.

Example 1: nums = [2, 3, 1, 1, 4]  ->  true  (0 -> 1 -> 4)
Example 2: nums = [3, 2, 1, 0, 4]  ->  false  (every route lands on index 3, which has jump length 0)
Example 3: nums = [0]  ->  true  (already at the last index)

Constraints: 1 <= len(nums) <= 10^4, 0 <= nums[i] <= 10^5.
