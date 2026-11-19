# Target Sum (medium)

Put a `+` or a `-` in front of every number in `nums`. Then add the signed numbers. Return how many ways of choosing the signs give exactly `target`.

Example 1: nums = [1, 1, 1, 1, 1], target = 3  ->  5  (make any one of the five numbers negative)
Example 2: nums = [1], target = 1  ->  1
Example 3: nums = [0], target = 0  ->  2  (`+0` and `-0` count as two ways)

Constraints: 1 <= len(nums) <= 20, 0 <= nums[i] <= 1000, the sum of `nums` is at most 1000, -1000 <= target <= 1000.
