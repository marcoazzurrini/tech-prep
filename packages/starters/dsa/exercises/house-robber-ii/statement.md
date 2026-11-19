# House Robber II (medium)

Same as House Robber, but the houses form a circle: the first and last houses are neighbours too. `nums[i]` is the cash in house `i`. Return the largest total you can take without choosing two adjacent houses.

Example 1: nums = [2, 3, 2]  ->  3  (houses 0 and 2 touch, so take house 1)
Example 2: nums = [1, 2, 3, 1]  ->  4  (houses 0 and 2)
Example 3: nums = [1, 2, 3]  ->  3

Constraints: 1 <= len(nums) <= 3000, 0 <= nums[i] <= 1000.
