# Burst Balloons (hard)

There is a row of balloons. Balloon `i` has the number `nums[i]` on it. You burst all of them, one at a time, in any order.

When you burst a balloon, you earn `left * nums[i] * right` coins. `left` and `right` are the numbers on the balloons next to it at that moment. If there is no balloon on a side, use `1` for that side. After the burst, its two neighbours become next to each other.

Return the largest number of coins you can earn.

Example 1: nums = [3, 1, 5, 8]  ->  167  (burst 1, 5, 3, 8: 3*1*5 + 3*5*8 + 1*3*8 + 1*8*1)
Example 2: nums = [1, 5]  ->  10  (burst 1, then 5: 1*1*5 + 1*5*1)
Example 3: nums = [7]  ->  7

Constraints: 1 <= len(nums) <= 300, 0 <= nums[i] <= 100.
