# Middle Gap (easy)

You get a list `nums` with an even number of items. Split the numbers into two halves of equal size: the lower half holds the smallest numbers, the upper half holds the largest. Return the gap between the halves: the smallest number of the upper half minus the largest number of the lower half.

Solve it with two heaps. Add the numbers one at a time, and keep the halves balanced.

Example 1: nums = [5, 1, 9, 3] -> 2 (lower half 1, 3; upper half 5, 9; 5 - 3 = 2) Example 2: nums = [1, 2] -> 1 Example 3: nums = [4, 4, 4, 4] -> 0

Constraints: 2 <= len(nums) <= 1000, len(nums) is even, -10^4 <= nums[i] <= 10^4.
